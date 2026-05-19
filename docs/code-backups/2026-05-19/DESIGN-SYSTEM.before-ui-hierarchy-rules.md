# YUNN Design System

이 문서는 YUNN 프로젝트 전반에 걸쳐 일관성 있는 UI/UX를 유지하기 위한 디자인 가이드라인입니다.

## 🎨 Color Palette

| Name | HEX Code | Usage |
| :--- | :--- | :--- |
| **Primary** | `#5CC1A6` | 주요 버튼, 링크, 포인트 컬러 |
| **Primary Dark** | `#3AAE92` | 호버 액션, 강조 상태 |
| **Primary Light**| `#DFF5EE` | 배경 강조, 배너, 선택된 상태 |
| **Accent** | `#E5484D` | 오류, 위시리스트, 경고 메시지 |
| **Text Main** | `#1A1A1A` | 기본 본문 텍스트, 제목 |
| **Text Light** | `#666666` | 부가 설명, 플레이스홀더, 서브 텍스트 |
| **Neutral BG** | `#FAFAFA` | 기본 페이지 배경, 연한 컨테이너 |
| **Category BG** | `#F2F2F2` | 카테고리 아이콘/카드 배경 |
| **Product BG** | `#F7F7F7` | 제품 이미지 래퍼 배경 |
| **Border** | `#EBEBEB` | 카드, 버튼 아웃라인, 구분선 |

## 📝 Typography

YUNN 프로젝트는 깨끗하고 모던한 느낌을 위해 **Pretendard** 폰트를 사용합니다.

- **Font Family:** `'Pretendard', sans-serif`
- **Weights:**
  - `Regular (400)`: 기본 본문
  - `Medium (500)`: 서브 타이틀, 버튼 텍스트, 강조 본문
  - `SemiBold (600)`: 타이틀 (h1, h2, h3), 핵심 수치
  - `Bold (700)`: 로고, 프로모션 타이틀

## 🧩 Components

### 1. Buttons
- **Solid Button (`.btn-primary` 공통 클래스 사용 권장)**
  - Background: `var(--primary)`
  - Text: `white`
  - Border-radius: `8px` 또는 완전 둥근(Rounded) 형태 `20px` (용도에 따라 구분)
  - Hover: `background: var(--primary-dark)`
- **Outline Button (`.btn-outline`)**
  - Background: `white`
  - Border: `1px solid var(--neutral-border)`
  - Hover: `border-color: var(--primary), color: var(--primary-dark)`

### 2. Shadows (그림자 효과)
- **Light Shadow (기본 호버링):** `box-shadow: 0 4px 8px rgba(0,0,0,0.05)`
- **Toast/Modal Shadow:** `box-shadow: 0 4px 12px rgba(0,0,0,0.15)`

### 3. Layout Utilities
- 중복되는 CSS 스타일(가운데 정렬 등)은 유틸리티 클래스로 분리하여 사용합니다.
- 예: `.flex-center { display: flex; justify-content: center; align-items: center; }`
