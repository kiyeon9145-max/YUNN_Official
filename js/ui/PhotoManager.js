// PhotoManager.js — Before/After 사진 업로드·압축·비교 (KPI 3: 성과 체감 기록)
// localStorage 5MB 제한 대응을 위해 업로드 즉시 JPEG로 리사이즈+압축한 dataUrl만 저장한다.
// 저장은 RoutineRepository에 위임하고, 저장 완료는 콜백으로 AppController에 알린다.

import {
    trackBeforePhotoUploaded,
    trackAfterPhotoUploaded,
    trackCompareViewed,
    markAnalyticsScreen
} from '../service/AnalyticsService.js';

// 압축 정책 (CLAUDE.md: canvas.toDataURL('image/jpeg', 0.5))
const COMPRESS_QUALITY  = 0.5;   // JPEG 품질 (0~1)
const COMPRESS_MAX_WIDTH = 1080; // 최대 가로 px — 초과 시 비율 유지하며 축소

export class PhotoManager {
    #repo;          // 사진 저장/조회
    #domain;        // 현재 Day·streak 조회 (이벤트 속성용)
    #onBeforeSaved; // Before 저장 완료 콜백
    #onAfterSaved;  // After 저장 완료 콜백

    // routine.js에서 호출 — 저장소와 도메인 로직을 연결한다.
    setDeps(repo, domain) {
        this.#repo   = repo;
        this.#domain = domain;
    }

    // Before/After 파일 input의 change 이벤트에 업로드 핸들러를 연결한다.
    init() {
        document.getElementById('before-photo-input')
            ?.addEventListener('change', e => this.#handleBeforeUpload(e));
        document.getElementById('after-photo-input')
            ?.addEventListener('change', e => this.#handleAfterUpload(e));
    }

    // 파일을 캔버스로 그려 리사이즈+JPEG 압축한 dataUrl을 반환한다 (Promise).
    // 원본 5~15MB → 약 300KB~1MB로 줄여 localStorage에 안전하게 저장.
    async #compressImage(file) {
        return new Promise(resolve => {
            const reader  = new FileReader();
            reader.onload = e => {
                const img  = new Image();
                img.onload = () => {
                    const scale  = Math.min(1, COMPRESS_MAX_WIDTH / img.width);
                    const canvas = document.createElement('canvas');
                    canvas.width  = Math.round(img.width  * scale);
                    canvas.height = Math.round(img.height * scale);
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', COMPRESS_QUALITY));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Before 사진 업로드 처리: 압축 → 저장({dataUrl, date}) → 이벤트 → 미리보기 → 완료 콜백.
    async #handleBeforeUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const dataUrl = await this.#compressImage(file);
        const photo   = { dataUrl, date: new Date().toISOString().slice(0, 10) }; // "YYYY-MM-DD"
        this.#repo.saveBeforePhoto(photo);
        trackBeforePhotoUploaded();

        const preview = document.getElementById('before-photo-preview');
        if (preview) { preview.src = dataUrl; preview.classList.add('visible'); }

        this.#onBeforeSaved?.();
    }

    // After 사진 업로드 처리. Before와 동일하나 이벤트에 현재 Day를 함께 보낸다.
    async #handleAfterUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const dataUrl = await this.#compressImage(file);
        const photo   = { dataUrl, date: new Date().toISOString().slice(0, 10) };
        this.#repo.saveAfterPhoto(photo);
        trackAfterPhotoUploaded(this.#domain.getDay());

        const preview = document.getElementById('after-photo-preview');
        if (preview) { preview.src = dataUrl; preview.classList.add('visible'); }

        this.#onAfterSaved?.();
    }

    // Before/After 두 사진을 나란히 렌더링하고 날짜 라벨을 채운다. compare_viewed 이벤트 발행.
    renderCompare() {
        markAnalyticsScreen('compare');
        const before = this.#repo.getBeforePhoto();
        const after  = this.#repo.getAfterPhoto();

        const beforeImg  = document.getElementById('compare-before-img');
        const afterImg   = document.getElementById('compare-after-img');
        const beforeDate = document.getElementById('compare-before-date');
        const afterDate  = document.getElementById('compare-after-date');

        if (beforeImg && before)  { beforeImg.src = before.dataUrl; }
        if (afterImg  && after)   { afterImg.src  = after.dataUrl; }
        if (beforeDate && before) beforeDate.textContent = this.#formatDate(before.date);
        if (afterDate  && after)  afterDate.textContent  = this.#formatDate(after.date);

        trackCompareViewed(this.#domain.getDay(), this.#domain.getStreak());
    }

    // Before 사진 존재 여부.
    hasBeforePhoto() {
        return Boolean(this.#repo.getBeforePhoto());
    }

    // After 사진 존재 여부 (compare 화면 라우팅 조건으로 AppController가 사용).
    hasAfterPhoto() {
        return Boolean(this.#repo.getAfterPhoto());
    }

    // 저장 완료 콜백 등록 (AppController가 화면 전환을 연결).
    onBeforeSaved(fn) { this.#onBeforeSaved = fn; }
    onAfterSaved(fn)  { this.#onAfterSaved  = fn; }

    // 저장된 "YYYY-MM-DD"를 인도식 표기("23 Jun 2026")로 변환. 값이 없으면 빈 문자열.
    #formatDate(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
}
