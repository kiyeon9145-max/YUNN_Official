# 보관: 설문 Step 1 — 이름/이메일/전화번호

2026-07-09, 설문 Step 1을 지역(도시) 질문으로 교체하면서 이 컴포넌트를 설문 흐름에서 뺐다.
`survey/page.tsx`에서 더 이상 import하지 않는다.

- 원래 위치: `app/survey/components/input-component.tsx`
- 원래 역할: 설문 Step 1 (이름 / 이메일 / 전화번호, WhatsApp 발송 안내)
- 뺀 이유: 진단 시작하자마자 개인정보부터 묻는 구조라 "리드 수집 폼"처럼 느껴져 이탈 위험이 큼

## 복원 시점

실제 서비스 오픈 시 리드 수집이 필요해지면 복원한다. 그때는 Step 1이 아니라 **설문 마지막(사진 업로드
다음, 결과 화면 진입 직전)에 넣는 걸 권장** — "루틴이 완성됐으니 어디로 보내드릴까요?" 맥락이 되어야
자연스럽다 (Step 1에 있을 때는 아직 루틴을 만들기도 전에 배송 안내부터 나와서 어색했음).

## 복원 방법

1. `input-component.tsx`를 `app/survey/components/`로 옮긴다.
2. `survey/page.tsx`에 새 스텝으로 배치하고 `onNext`에서 `merge({ name, email, phone })` 연결.
3. `ValidCheck`는 이미 `button-component.tsx`로 옮겨져 있으므로 import만 `from "./button-component"`로 맞추면 됨.
