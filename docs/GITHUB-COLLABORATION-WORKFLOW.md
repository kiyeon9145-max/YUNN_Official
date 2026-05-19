# GitHub Collaboration Workflow

이 문서는 YUNN 프로젝트를 여러 바이브코딩 툴, AI 어시스턴트, 개발자가 함께 작업할 때 사용하는 GitHub 협업 규칙입니다.

## Purpose

GitHub 저장소를 단순 파일 백업이 아니라, 다음 목적을 위한 기준점으로 사용합니다.

- 각 웹페이지 제작 작업 내용을 추적한다.
- 마음에 들지 않는 변경을 이전 상태로 되돌릴 수 있게 한다.
- 어느 파일과 어느 화면이 언제 왜 바뀌었는지 찾을 수 있게 한다.
- 여러 작업자가 같은 프로젝트를 동시에 개발해도 충돌을 줄인다.
- Codex, Cursor, Replit, 기타 바이브코딩 툴이 같은 규칙으로 작업하게 한다.

Official repository:

```text
https://github.com/kiyeon9145-max/YUNN_Official_v2.git
```

## Branch Strategy

`main`은 항상 안정 버전으로 유지합니다.

새 작업은 반드시 별도 브랜치에서 진행합니다.

Branch naming examples:

```text
feature/home-hero-polish
feature/survey-step2-gender-age
fix/email-validation
fix/header-logo-alignment
docs/github-workflow
```

Rules:

- 직접 `main`에서 큰 UI 변경을 하지 않는다.
- 작은 문구 수정도 가능하면 작업 브랜치에서 커밋한다.
- 한 브랜치는 한 목적만 가진다.
- 여러 툴이 동시에 작업할 때는 같은 파일을 동시에 수정하지 않도록 브랜치 목적을 나눈다.

## Before Work

작업 시작 전:

```bash
git status
git pull origin main
git checkout -b feature/short-task-name
```

이미 작업 브랜치가 있다면:

```bash
git status
git pull origin main
```

Rules:

- 작업 전 항상 최신 원격 상태를 가져온다.
- 변경 파일이 있으면 먼저 무엇이 바뀌었는지 확인한다.
- 내가 만들지 않은 변경은 되돌리지 않는다.
- `.DS_Store` 같은 OS 임시 파일은 커밋하지 않는다.

## During Work

각 변경은 작게 나눠서 커밋합니다.

Good commit examples:

```text
fix: align survey header logo
feat: add survey step 2 gender age selection
style: match step 2 cards to skin type option UI
docs: record GitHub collaboration workflow
```

Rules:

- 한 커밋에는 한 목적만 담는다.
- UI 변경은 가능한 경우 로컬 브라우저에서 확인한다.
- 큰 화면 변경 전후에는 `docs/code-backups/YYYY-MM-DD/`에 복구용 사본을 남긴다.
- 변경 이유, 수정 파일, 검증 결과는 `docs/IMPLEMENTATION-LOG.md`에 기록한다.

## Pull Request Flow

작업이 끝나면:

```bash
git add .
git commit -m "type: short description"
git push origin branch-name
```

그 다음 GitHub에서 Pull Request를 생성합니다.

PR에는 다음 내용을 적습니다.

- 어떤 화면을 바꿨는지
- 왜 바꿨는지
- 주요 변경 파일
- 확인한 URL 또는 테스트 방법
- 복구용 백업 파일 경로
- Figma 기준 작업이면 Figma 프레임 또는 링크

## Restore Strategy

이전 상태로 돌아가는 방법은 세 가지입니다.

1. 특정 파일만 로컬 백업에서 복구

```bash
cp docs/code-backups/YYYY-MM-DD/file.backup-name.html file.html
```

2. Git 커밋 단위로 변경 확인

```bash
git log --oneline
git show commit-hash
```

3. 특정 커밋의 파일만 복구

```bash
git checkout commit-hash -- path/to/file
```

주의:

- 전체 프로젝트를 되돌리는 `git reset --hard`는 사용자 승인 없이 실행하지 않는다.
- 이미 원격에 올라간 커밋을 지울 때는 먼저 사용자에게 확인한다.

## Conflict Rules

여러 작업자가 같은 파일을 수정하면 충돌이 생길 수 있습니다.

Rules:

- 충돌이 난 파일은 자동으로 덮어쓰지 않는다.
- 어떤 변경이 사용자/다른 툴의 작업인지 먼저 확인한다.
- `index.html`, `survey.html`, `docs/IMPLEMENTATION-LOG.md`는 충돌 가능성이 높은 파일로 간주한다.
- 충돌 해결 후에는 실제 페이지가 깨지지 않는지 로컬에서 확인한다.

## Source Of Truth

우선순위:

1. GitHub `main` 브랜치의 최신 안정 버전
2. 현재 작업 브랜치의 커밋 기록
3. `docs/IMPLEMENTATION-LOG.md`
4. `docs/code-backups/YYYY-MM-DD/`
5. Figma 디자인 링크와 프레임

## AI Assistant Responsibilities

AI 어시스턴트는 다음을 지켜야 합니다.

- 작업 전 어떤 파일을 수정할지 사용자에게 알려준다.
- 변경 전후 백업이 필요한 경우 백업 파일을 만든다.
- 구현 로그를 업데이트한다.
- 사용자가 요청하면 Git 커밋/푸시까지 진행한다.
- 원격 저장소에 push하기 전 `git status`로 커밋 대상 파일을 확인한다.
- `.DS_Store`, 임시 캡처 파일, 불필요한 생성물은 커밋하지 않는다.
- 다른 작업자의 변경을 임의로 되돌리지 않는다.

