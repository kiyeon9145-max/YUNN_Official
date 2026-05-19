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

## UI Hierarchy Consistency Rules

YUNN 웹사이트의 모든 화면은 같은 제품 안에 있다는 느낌이 나야 한다. 새 화면이나 새 컴포넌트를 만들 때는 기존 화면의 위계를 먼저 확인하고, 특별한 이유가 없다면 아래 기준을 그대로 따른다.

### Global Mobile Shell
- 모바일 상태바, 네트워크/배터리 표시, 상단 메뉴 아이콘, 로고, 우측 아이콘 묶음은 모든 주요 모바일 화면에서 같은 위치와 크기 위계를 유지한다.
- YUNN 로고는 화면 중앙선을 기준으로 배치한다.
- 메뉴 아이콘과 우측 아이콘 묶음은 로고와 같은 시각적 수평선에 있어야 한다.
- 우측 아이콘 간격은 페이지마다 달라지지 않게 같은 그룹 간격을 유지한다.

### Survey Typography
- 설문 페이지의 주요 질문 제목은 기본적으로 `24px`, `700`, `letter-spacing: -0.01em` 기준을 사용한다.
- 제목 내 핵심 강조 단어는 Primary 계열 민트 컬러를 사용한다.
- 설문 설명 문구는 기존 Step 1/2의 본문 위계를 기준으로 하며, 페이지마다 임의로 작아지거나 커지지 않게 한다.
- 답변 카드의 메인 텍스트는 `1.05rem` 또는 계산값 기준 약 `16.8px`, `700`을 사용한다.

### Survey Answer Cards
- 설문 답변 박스는 같은 단계군 안에서 동일한 카드 위계를 유지한다.
- 기본 답변 카드 기준:
  - `min-height: 92px`
  - `border-radius: 14px`
  - `background: #FFFFFF`
  - `border: 2px solid #FFFFFF`
  - `box-shadow: 0 2px 12px rgba(0,0,0,0.04)`
  - `padding: 20px 24px`
- 선택 상태 기준:
  - `border-color: #3AAE92`
  - `background: #F5FAF9`
  - `box-shadow: none`
- 체크/라디오 형태는 질문 성격에 맞출 수 있지만, 카드 크기, 여백, 제목 포인트, 선택 색상은 같은 위계를 유지한다.
- 이미지 카드처럼 특수한 답변 카드를 사용할 때도 텍스트 포인트, 선택 색상, 라운드, 여백은 기존 카드 위계를 해치지 않게 맞춘다.

### Design QA Rule
- 새 UI를 추가하거나 수정한 뒤에는 최소한 현재 페이지와 가장 가까운 기존 기준 페이지를 비교한다.
- 설문 답변 카드 수정 시 Step 1/2 또는 직전 동일 컴포넌트의 계산 스타일과 비교한다.
- 비교해야 하는 항목은 `font-size`, `font-weight`, `line-height`, `border-radius`, `min-height`, `box-shadow`, `background`, `selected state`다.
- 사용자가 별도 레퍼런스를 주더라도 기존 YUNN 위계와 충돌하면 기존 디자인 시스템을 우선하고, 필요한 차이는 문서에 남긴다.

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
