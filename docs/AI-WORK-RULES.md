# AI Work Rules

이 문서는 YUNN 프로젝트를 진행하는 AI 어시스턴트(및 개발자)가 반드시 준수해야 하는 작업 원칙을 정의합니다. 모든 작업 전 이 문서를 숙지해야 합니다.

## Project Structure Rules

- **/pages**
  - User-facing HTML pages only
  - Do not create duplicate version files

- **/assets/images**
  - Store images only
  - Do not store HTML or scripts

- **/scripts**
  - Utility Python scripts only
  - No production business logic

- **/generators**
  - Core reusable generation logic
  - Keep generator files modular

- **/archive**
  - Old or unused files only

---

## File Naming Rules

**DO:**
- survey.html
- survey_gen.py

**DON'T:**
- survey_final.html
- survey_v2.html
- survey_real_final.py

**Rule:** Use Git commits for versioning instead of adding suffixes to file names.

---

## Before Editing

- Explain which files will be modified before making any changes.
- Check the existing structure before creating new files.
- Reuse existing files whenever possible.

---

## Forbidden Actions

- Do not rename folders without approval.
- Do not move files automatically.
- Do not create duplicate pages.
- Do not overwrite the existing design system.

---

## Git Rules

**Before major edits:**
```bash
git add .
git commit -m "backup before edit"
```

**After edits:**
```bash
git add .
git commit -m "describe changes"
```
