- 공용 드롭다운 컴포넌트 (접근성 + 키보드 네비)
- 다양한 사용처 대응: 상태/필터/정렬/페이지 사이즈 선택 등
- 외부 클릭·ESC 닫기, 초점 이동(열릴 때 리스트로), 하이라이트 가시화
- ARIA 완비: button/listbox/option, aria-activedescendant
- Controlled / Uncontrolled 모두 지원
- classes 슬롯 + align 으로 손쉬운 커스터마이징

# 📌 Dropdown 사용 가이드

## 1. 개요

드롭다운은 버튼을 눌러 목록을 열고, 바깥 클릭이나 ESC로 닫히며, 열릴 때 리스트에 자동 포커스가 이동합니다.

구성 파트:

- **훅 (hooks)**
  - `useOutsideClickAndEsc(open, rootRef, onOutside, onEsc?)` : 바깥 클릭/ESC로 닫기
  - `useAutoFocusWhenOpen(open, listRef)` : 열릴 때 리스트에 포커스
  - `useKeepActiveVisible(open, listRef, activeIndex)` : 하이라이트 항목이 보이도록 최소 스크롤
- **유틸 (listNav/dom)**
  - `firstEnabledIndex / lastEnabledIndex / nextEnabledIndex` : 비-disabled만 순환 네비
  - `scrollChildIntoViewNearest` : `scrollIntoView({ block: 'nearest' })` 래퍼
- **스타일 토큰**
  - `WRAPPER_BASE`, `BUTTON_BASE`, `MENU_BASE`, `OPTION_*`, `menuAlignClass`

---

## 2. 기본 사용법

```tsx
import Dropdown from '@/components/common/Dropdown/Dropdown'

const options = [
  { value: 'all', label: '전체' },
  { value: 'progress', label: '진행 중' },
  { value: 'pending', label: '대기 중' },
  { value: 'done', label: '종료됨' },
]

export default function Basic() {
  return <Dropdown options={options} placeholder="선택" />
}
```

## 3. 제어형과 비제어형

비제어형 (내부 상태 사용)

```tsx
import Dropdown from '@/components/common/Dropdown/Dropdown'
;<Dropdown options={options} defaultValue="all" />
```

제어형 (외부 상태로 값 제어)

```tsx
import { useState } from 'react'
import Dropdown from '@/components/common/Dropdown/Dropdown'

const [value, setValue] = useState('all')

<Dropdown
  options={options}
  value={value}
  onChange={(v) => setValue(v)}
/>
```

## 4. 빠른 커스터 마이징 예시

## 정렬:

```tsx
<Dropdown options={options} align="start" /> // 기본 좌
<Dropdown options={options} align="end" /> // 오른쪽
```

---

## 클래스 슬롯:

```tsx
<Dropdown
  options={options}
  classes={{
    wrapper: 'w-64',
    button: 'w-full',
    menu: 'max-h-72',
    option: 'text-sm',
  }}
/>
```

---

## 비활성 옵션:

```tsx
const opts = [
  { value: 'all', label: '전체' },
  { value: 'vip', label: 'VIP 전용', disabled: true },
]
<Dropdown options={opts} disabled />
```
