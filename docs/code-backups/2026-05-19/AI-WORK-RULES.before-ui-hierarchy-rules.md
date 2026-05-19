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

GitHub를 단순 백업 저장소가 아니라 여러 작업자/AI 툴이 함께 쓰는 협업 기준점으로 사용합니다.
자세한 브랜치, 커밋, PR, 복구 규칙은 `docs/GITHUB-COLLABORATION-WORKFLOW.md`를 따른다.

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

**Automated GitHub Push (AI Responsibility):**
- AI 어시스턴트는 터미널 명령어를 통해 사용자를 대신하여 Git 백업 및 커밋 작업을 수행할 수 있습니다.
- 작업 완료 후, 혹은 사용자의 별도 요청 시 `git push` 명령을 사용하여 원격 저장소(GitHub)로 최신 변경 사항을 업로드(Push)해야 합니다.
- 공식 원격 백업 저장소는 `https://github.com/kiyeon9145-max/YUNN_Official_v2.git` 입니다.
- 앞으로 모든 주요 작업은 로컬 `docs/code-backups/` 백업과 구현 로그를 남긴 뒤, Git 커밋/푸시 가능한 상태로 정리합니다.
- 여러 툴 또는 여러 개발자가 동시에 작업하는 경우, 각 작업은 별도 브랜치에서 진행하고 Pull Request로 합치는 것을 기본으로 합니다.
- 이전 상태 복구는 `docs/code-backups/`, `git log`, 특정 커밋의 파일 복구 순서로 검토합니다.
