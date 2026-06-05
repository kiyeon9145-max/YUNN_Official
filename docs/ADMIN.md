# YUNN Admin Page — 구현 지시서

## 목표
pages/admin.html 을 새로 생성한다.
기존 DESIGN-SYSTEM.md 스타일을 따르고,
구글 시트(yunn-google-creds.json)와 연동하여
11개 스킨 타입 루틴을 편집할 수 있는 관리자 페이지를 만든다.

## 파일 생성 위치
- pages/admin.html       ← 메인 어드민 페이지 (단일 파일)
- scripts/admin.js       ← 시트 연동 + CRUD 로직
- docs/ADMIN.md          ← 이 문서 (참고용)

## 참고 문서 (반드시 먼저 읽을 것)
- docs/DESIGN-SYSTEM.md  ← 컬러, 폰트, 컴포넌트 기준
- docs/PRD.md            ← 제품 전체 맥락
- docs/YUNN-SKIN-TYPE-MATRIX.md ← 11개 타입 데이터 구조
- docs/API.md            ← 구글 시트 연동 방식 확인

## 화면 구성 (SPA, 페이지 전환 없음)
1. 사이드바 네비게이션
   - 루틴 관리 (기본 화면)
   - 알림 문구
   - 구글 시트 연동 상태

2. 루틴 관리 화면
   - 11개 스킨 타입 목록 (게시됨 / 수정 중 상태)
   - 타입 클릭 → 편집기 열림

3. 루틴 편집기
   - AM / PM 탭 전환
   - 각 단계: 텍스트 인라인 편집 가능
   - 단계 순서: 드래그 앤 드롭 (SortableJS 사용)
   - 설명 문구 4개 필드: 상황공감 / 원인설명 / 루틴방향 / 기대효과
   - 저장 버튼 → 구글 시트에 반영

4. 알림 문구 화면
   - morning / evening / reapply 타입별 메시지 목록
   - 인라인 텍스트 편집 + 저장

## 구글 시트 탭 구조 (없으면 자동 생성)
- routine_types  : type_id | name | description | color_hex | is_published
- routine_steps  : type_id | time(am/pm) | step_order | product_name | instruction
- copy_texts     : type_id | copy_type | text_ko | text_en
- notifications  : noti_type | message | is_active

## 진입 방식 — 비밀번호 게이트

### 동작 방식
- `pages/admin.html` 접속 시 비밀번호 입력 화면을 먼저 표시한다.
- 정답 입력 → `sessionStorage`에 인증 상태 저장 → 어드민 화면으로 전환.
- 브라우저 탭을 닫으면 자동 로그아웃 (`sessionStorage` 초기화).
- 새로고침해도 세션 유지 (탭이 열려 있는 동안).

### 비밀번호 설정
- `scripts/admin.js` 상단 `ADMIN_PASSWORD` 상수로 관리한다.
- 예: `const ADMIN_PASSWORD = "yunn2024";`
- 배포 시 반드시 변경 권장.

### UI 구성
- 배경: `var(--neutral-bg)` (`#FAFAFA`)
- 중앙 카드: 흰 배경, `border-radius: 14px`, `box-shadow: 0 4px 12px rgba(0,0,0,0.10)`
- YUNN 로고 이미지 + `Admin` 텍스트
- 비밀번호 입력창: `border: 1px solid var(--border)`, `border-radius: 8px`
- 확인 버튼: `btn-primary` 스타일 (`background: var(--primary)`, `color: white`)
- 오류 메시지: `color: var(--accent)` (`#E5484D`), `font-size: 13px`
- 3회 오류 시 10초 잠금 + 카운트다운 표시 후 자동 해제

### 세션 키
- `sessionStorage` 키: `yunn_admin_auth`
- 값: `"1"` (인증 완료), 없거나 다른 값이면 게이트 표시

## 기술 조건
- 순수 HTML/CSS/JS (프레임워크 없음, 기존 pages/*.html 방식 동일하게)
- SortableJS: https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js
- 구글 Sheets API v4, 기존 yunn-google-creds.json 사용
- 모바일 대응 불필요 (데스크톱 전용)
- 비밀번호 게이트: sessionStorage 기반 (탭 단위 인증)
