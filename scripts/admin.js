// YUNN Admin — Google Sheets API v4 연동 + CRUD 로직
// 로컬 실행 전용. yunn-google-creds.json 에서 API 키를 읽어온다.

// ── 비밀번호 게이트 설정 ────────────────────────────────────────────────────
// 배포 시 반드시 변경할 것. sessionStorage 키: yunn_admin_auth
const ADMIN_PASSWORD = "yunn2024";
const ADMIN_SESSION_KEY = "yunn_admin_auth";

const ADMIN = (() => {
  // ── 설정 ────────────────────────────────────────────────────────────────
  const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
  const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

  // 탭 이름
  const SHEET = {
    TYPES: 'routine_types',
    STEPS: 'routine_steps',
    COPY:  'copy_texts',
    NOTI:  'notifications',
  };

  // 11개 스킨 타입 (YUNN-SKIN-TYPE-MATRIX.md 기준)
  const SKIN_TYPES = [
    { id: 'oily_acne',            name: 'Oil Clear',      keywords: 'Oily · Acne-prone · Sebum Control',    color: '#5CC1A6' },
    { id: 'oily_marks',           name: 'Glow Restore',   keywords: 'Oily · Post-acne · Repair',            color: '#3AAE92' },
    { id: 'oily_pigmentation',    name: 'Radiance Shield',keywords: 'Oily · Pigmentation · UV Defense',      color: '#2E9B80' },
    { id: 'oily_tone',            name: 'Glow Balance',   keywords: 'Oily · Uneven Tone · Glow',            color: '#5CC1A6' },
    { id: 'dry_acne',             name: 'Calm Repair',    keywords: 'Dry · Breakout · Barrier',             color: '#A8D8CC' },
    { id: 'dry_marks',            name: 'Barrier Glow',   keywords: 'Dry · Repair · Barrier Stress',        color: '#7EC8B8' },
    { id: 'dry_pigmentation',     name: 'Soft Glow',      keywords: 'Dry · Pigmentation · Dehydrated',      color: '#B2DDD5' },
    { id: 'dry_tone',             name: 'Soft Bright',    keywords: 'Dry · Hydration · Even Tone',          color: '#C5E8E2' },
    { id: 'combination_acne',     name: 'Clear Harmony',  keywords: 'Combination · Acne-prone · Oil Balance',color: '#4AB5A0' },
    { id: 'combination_tone',     name: 'Glow Harmony',   keywords: 'Combination · Uneven Tone · Radiance', color: '#6BC4B0' },
    { id: 'normal_any',           name: 'Pure Radiance',  keywords: 'Normal · Natural Glow · Balanced',     color: '#DFF5EE' },
  ];

  // ── 내부 상태 ────────────────────────────────────────────────────────────
  let _config = null;   // { spreadsheetId, apiKey } | { spreadsheetId, accessToken }
  let _gapi   = null;   // window.gapi (Google API client)
  let _useKey = false;  // API Key 방식이면 true, OAuth면 false

  // ── 초기화 ───────────────────────────────────────────────────────────────

  /**
   * yunn-google-creds.json 을 fetch하여 인증 정보를 로드한다.
   * 파일 위치: 프로젝트 루트 (로컬 실행이므로 same-origin fetch 가능).
   * 지원 형식 A — API Key (읽기/쓰기가 공개 시트일 때):
   *   { "spreadsheetId": "...", "apiKey": "..." }
   * 지원 형식 B — Service Account JSON (googleapis npm 없이 직접 사용 불가).
   *   이 경우 accessToken을 별도로 입력받아 사용한다.
   */
  async function loadConfig() {
    try {
      // localStorage 우선 — file:// 프로토콜에서 fetch가 차단될 때 대비
      const stored = localStorage.getItem('yunn_admin_creds');
      if (stored) {
        const cached = JSON.parse(stored);
        if (cached.spreadsheetId && cached.apiKey) {
          _config = { spreadsheetId: cached.spreadsheetId, apiKey: cached.apiKey };
          _useKey = true;
          return { ok: true, mode: 'apiKey' };
        }
      }
      const res = await fetch('../yunn-google-creds.json');
      if (!res.ok) throw new Error('creds file not found');
      const raw = await res.json();

      if (raw.spreadsheetId && raw.apiKey) {
        _config  = { spreadsheetId: raw.spreadsheetId, apiKey: raw.apiKey };
        _useKey  = true;
        return { ok: true, mode: 'apiKey' };
      }
      if (raw.spreadsheetId) {
        _config = { spreadsheetId: raw.spreadsheetId };
        return { ok: true, mode: 'tokenRequired' };
      }
      throw new Error('spreadsheetId missing in creds');
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  function saveManualConfig(spreadsheetId, apiKey) {
    _config = { spreadsheetId, apiKey };
    _useKey = true;
    localStorage.setItem('yunn_admin_creds', JSON.stringify({ spreadsheetId, apiKey }));
    return { ok: true, mode: 'apiKey' };
  }

  /** gapi 클라이언트 초기화 (API Key 모드) */
  async function initGapiClient(apiKey) {
    return new Promise((resolve, reject) => {
      window.gapi.load('client', async () => {
        try {
          await window.gapi.client.init({
            apiKey,
            discoveryDocs: [DISCOVERY_DOC],
          });
          _gapi = window.gapi;
          resolve();
        } catch (e) { reject(e); }
      });
    });
  }

  // ── 저수준 Sheets 요청 ──────────────────────────────────────────────────

  /** Bearer 토큰 또는 API Key 헤더를 포함한 fetch */
  async function sheetsFetch(path, options = {}) {
    if (!_config) throw new Error('설정 미로드 — 구글 시트 연동 탭에서 정보를 입력하세요.');
    const base = 'https://sheets.googleapis.com/v4/spreadsheets';
    const sep  = path.includes('?') ? '&' : '?';
    const url  = _useKey
      ? `${base}/${_config.spreadsheetId}${path}${sep}key=${_config.apiKey}`
      : `${base}/${_config.spreadsheetId}${path}`;

    const headers = { 'Content-Type': 'application/json' };
    if (!_useKey && _config.accessToken) {
      headers['Authorization'] = `Bearer ${_config.accessToken}`;
    }

    const res = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }
    return res.json();
  }

  /** 범위 값 읽기 */
  async function readRange(range) {
    const data = await sheetsFetch(`/values/${encodeURIComponent(range)}`);
    return data.values || [];
  }

  /** 범위 값 쓰기 (valueInputOption: USER_ENTERED) */
  async function writeRange(range, values) {
    return sheetsFetch(
      `/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
      { method: 'PUT', body: JSON.stringify({ range, values }) }
    );
  }

  /** 행 추가 */
  async function appendRows(range, values) {
    return sheetsFetch(
      `/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      { method: 'POST', body: JSON.stringify({ values }) }
    );
  }

  // ── 시트 탭 자동 생성 ────────────────────────────────────────────────────

  async function ensureSheets() {
    const meta = await sheetsFetch('');
    const existing = (meta.sheets || []).map(s => s.properties.title);
    const needed   = Object.values(SHEET).filter(t => !existing.includes(t));
    if (!needed.length) return;

    const requests = needed.map(title => ({
      addSheet: { properties: { title } }
    }));

    await sheetsFetch(':batchUpdate', {
      method: 'POST',
      body: JSON.stringify({ requests }),
    });

    // 헤더 행 삽입
    const headers = {
      [SHEET.TYPES]: [['type_id','name','description','color_hex','is_published']],
      [SHEET.STEPS]: [['type_id','time','step_order','product_name','instruction']],
      [SHEET.COPY]:  [['type_id','copy_type','text_ko','text_en']],
      [SHEET.NOTI]:  [['noti_type','message','is_active']],
    };
    for (const tab of needed) {
      await appendRows(`${tab}!A1`, headers[tab]);
    }
  }

  // ── 루틴 타입 CRUD ───────────────────────────────────────────────────────

  async function fetchRoutineTypes() {
    const rows = await readRange(`${SHEET.TYPES}!A2:E`);
    return rows.map(r => ({
      type_id:      r[0] || '',
      name:         r[1] || '',
      description:  r[2] || '',
      color_hex:    r[3] || '#5CC1A6',
      is_published: r[4] === 'TRUE' || r[4] === 'true' || r[4] === '1',
    }));
  }

  async function upsertRoutineType(typeObj) {
    const rows = await readRange(`${SHEET.TYPES}!A:A`);
    const idx  = rows.findIndex(r => r[0] === typeObj.type_id);
    if (idx <= 0) {
      // 새 행 추가
      await appendRows(`${SHEET.TYPES}!A:E`, [[
        typeObj.type_id, typeObj.name, typeObj.description,
        typeObj.color_hex, typeObj.is_published ? 'TRUE' : 'FALSE',
      ]]);
    } else {
      const row = idx + 1;
      await writeRange(`${SHEET.TYPES}!A${row}:E${row}`, [[
        typeObj.type_id, typeObj.name, typeObj.description,
        typeObj.color_hex, typeObj.is_published ? 'TRUE' : 'FALSE',
      ]]);
    }
  }

  // ── 루틴 스텝 CRUD ───────────────────────────────────────────────────────

  async function fetchRoutineSteps(typeId) {
    const rows = await readRange(`${SHEET.STEPS}!A2:E`);
    return rows
      .filter(r => r[0] === typeId)
      .map(r => ({
        type_id:      r[0],
        time:         r[1] || 'am',
        step_order:   parseInt(r[2]) || 0,
        product_name: r[3] || '',
        instruction:  r[4] || '',
      }))
      .sort((a, b) => a.step_order - b.step_order);
  }

  /**
   * typeId 의 모든 스텝을 새 배열로 교체한다 (기존 행 삭제 후 재삽입).
   * steps: [{ time, step_order, product_name, instruction }]
   */
  async function saveRoutineSteps(typeId, steps) {
    // 1. 전체 행 읽기
    const all = await readRange(`${SHEET.STEPS}!A2:E`);
    // 2. 해당 typeId 행의 시트 행 번호 목록 (1-based, header=1)
    const targetRows = all.reduce((acc, r, i) => {
      if (r[0] === typeId) acc.push(i + 2);
      return acc;
    }, []);

    // 3. 해당 행들을 빈 값으로 클리어 (Sheets API에는 deleteRow batchUpdate 필요하지만
    //    단순 MVP를 위해 해당 셀을 빈 문자열로 덮어쓴다)
    for (const rowNum of targetRows) {
      await writeRange(`${SHEET.STEPS}!A${rowNum}:E${rowNum}`, [['','','','','']]);
    }

    // 4. 새 스텝 추가
    const newRows = steps.map((s, i) => [
      typeId, s.time, i + 1, s.product_name, s.instruction
    ]);
    if (newRows.length) await appendRows(`${SHEET.STEPS}!A:E`, newRows);
  }

  // ── 카피 텍스트 CRUD ─────────────────────────────────────────────────────

  async function fetchCopyTexts(typeId) {
    const rows = await readRange(`${SHEET.COPY}!A2:D`);
    const result = {};
    rows.filter(r => r[0] === typeId).forEach(r => {
      result[r[1]] = { ko: r[2] || '', en: r[3] || '' };
    });
    return result; // { 상황공감: {ko,en}, 원인설명: {ko,en}, ... }
  }

  async function saveCopyTexts(typeId, copyMap) {
    const all     = await readRange(`${SHEET.COPY}!A2:D`);
    const handled = new Set();

    for (const [copyType, texts] of Object.entries(copyMap)) {
      const idx = all.findIndex(r => r[0] === typeId && r[1] === copyType);
      if (idx >= 0) {
        const row = idx + 2;
        await writeRange(`${SHEET.COPY}!A${row}:D${row}`, [
          [typeId, copyType, texts.ko, texts.en]
        ]);
      } else {
        await appendRows(`${SHEET.COPY}!A:D`, [[typeId, copyType, texts.ko, texts.en]]);
      }
      handled.add(copyType);
    }
  }

  // ── 알림 문구 CRUD ───────────────────────────────────────────────────────

  async function fetchNotifications() {
    const rows = await readRange(`${SHEET.NOTI}!A2:C`);
    return rows.map(r => ({
      noti_type:  r[0] || '',
      message:    r[1] || '',
      is_active:  r[2] === 'TRUE' || r[2] === 'true' || r[2] === '1',
    }));
  }

  async function saveNotification(notiType, message, isActive) {
    const all = await readRange(`${SHEET.NOTI}!A:A`);
    const idx = all.findIndex(r => r[0] === notiType);
    if (idx <= 0) {
      await appendRows(`${SHEET.NOTI}!A:C`, [[notiType, message, isActive ? 'TRUE' : 'FALSE']]);
    } else {
      const row = idx + 1;
      await writeRange(`${SHEET.NOTI}!A${row}:C${row}`, [
        [notiType, message, isActive ? 'TRUE' : 'FALSE']
      ]);
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────
  return {
    SKIN_TYPES,
    SHEET,
    loadConfig,
    initGapiClient,
    ensureSheets,
    fetchRoutineTypes,
    upsertRoutineType,
    fetchRoutineSteps,
    saveRoutineSteps,
    fetchCopyTexts,
    saveCopyTexts,
    fetchNotifications,
    saveNotification,
    setAccessToken(token) { if (_config) _config.accessToken = token; _useKey = false; },
    getConfig() { return _config; },
    saveManualConfig,
  };
})();
