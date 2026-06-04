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

## 기술 조건
- 순수 HTML/CSS/JS (프레임워크 없음, 기존 pages/*.html 방식 동일하게)
- SortableJS: https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js
- 구글 Sheets API v4, 기존 yunn-google-creds.json 사용
- 모바일 대응 불필요 (데스크톱 전용)
- 로그인 없음 (로컬 실행 전용)
