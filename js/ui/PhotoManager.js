// PhotoManager.js — 사진 업로드, 압축, Before/After 비교

import {
    trackBeforePhotoUploaded,
    trackAfterPhotoUploaded,
    trackCompareViewed,
    markAnalyticsScreen
} from '../service/AnalyticsService.js';

const COMPRESS_QUALITY  = 0.5;
const COMPRESS_MAX_WIDTH = 1080;

export class PhotoManager {
    #repo;
    #domain;
    #onBeforeSaved;
    #onAfterSaved;

    setDeps(repo, domain) {
        this.#repo   = repo;
        this.#domain = domain;
    }

    init() {
        document.getElementById('before-photo-input')
            ?.addEventListener('change', e => this.#handleBeforeUpload(e));
        document.getElementById('after-photo-input')
            ?.addEventListener('change', e => this.#handleAfterUpload(e));
    }

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

    async #handleBeforeUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const dataUrl = await this.#compressImage(file);
        const photo   = { dataUrl, date: new Date().toISOString().slice(0, 10) };
        this.#repo.saveBeforePhoto(photo);
        trackBeforePhotoUploaded();

        const preview = document.getElementById('before-photo-preview');
        if (preview) { preview.src = dataUrl; preview.classList.add('visible'); }

        this.#onBeforeSaved?.();
    }

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

    hasBeforePhoto() {
        return Boolean(this.#repo.getBeforePhoto());
    }

    hasAfterPhoto() {
        return Boolean(this.#repo.getAfterPhoto());
    }

    onBeforeSaved(fn) { this.#onBeforeSaved = fn; }
    onAfterSaved(fn)  { this.#onAfterSaved  = fn; }

    #formatDate(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
}
