# 내부 JavaScript 로직 명세서
이 프로젝트는 MVP 단계이므로 별도의 백엔드 서버(Node.js, Firebase 등)를 사용하지 않습니다. 따라서 통상적인 REST API 대신, 브라우저의 `localStorage`를 활용하는 JavaScript 내부 함수들을 API처럼 정의하여 사용합니다.

---

## 1. 진단 데이터 저장 API

### `saveQuizResult(data)`
- **역할:** 설문 및 사진 데이터를 로컬 스토리지에 저장합니다.
- **입력 파라미터 (data):** 
  ```json
  {
    "skinType": "oily",
    "photoBefore": "data:image/jpeg;base64,..."
  }
  ```
- **저장 위치:** `localStorage.setItem('yunn_user', JSON.stringify(data))`
- **반환값:** 성공 시 `true`, 실패 시 `false`
- **오류 메시지 규칙:** 이미지 용량이 초과되었을 때 "Error: 이미지가 너무 큽니다." 반환.

---

## 2. 제품 추천 API

### `getRecommendedProducts(skinType)`
- **역할:** 사용자의 피부 타입에 맞는 추천 제품 목록을 가져옵니다.
- **입력 파라미터:** `skinType` (예: "oily", "dry", "acne")
- **반환값 예시:**
  ```json
  [
    { "id": 1, "name": "YUNN Glow Serum", "price": "₹899" },
    { "id": 2, "name": "YUNN Hydrating Moisturiser", "price": "₹699" }
  ]
  ```

---

## 3. 데일리 루틴 체크 API

### `checkDailyRoutine(day)`
- **역할:** 사용자가 오늘 분량의 스킨케어 루틴을 완료했음을 기록합니다.
- **입력 파라미터:** `day` (숫자, 예: 1, 2, ... 14)
- **처리 로직:** `localStorage`의 `yunn_user.dailyCheck` 배열을 업데이트합니다.
- **오류 메시지 규칙:** 루틴 시작 전일 경우 "Error: 아직 루틴을 시작하지 않았습니다." 경고창(alert) 표시.
