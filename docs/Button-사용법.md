# Button 컴포넌트 사용법

작성자: 함서연

## 📌 개요

공용 버튼 컴포넌트 사용 방법입니다.

---

## 🛠 사용 방법

### 1. Button을 import 합니다.

```tsx
import { Button } from '@components/ui/Button'
```

### 2. 사용하고자 하는 jsx 컴포넌트 함수의 return문 안에서 Button을 사용합니다.

```tsx
return <Button btnText={'기본 버튼'} onClick={handleClick} />
```

### 3. 아래 "ButtonProps 안내"를 참고하여 사용하고자 하는 버튼 형식에 맞게 props를 추가합니다.

### ButtonProps 안내(`types` 디렉터리의 `button.ts`)

- 모든 props는 optional(선택 입력 사항)

- `btnStyle`: 버튼의 스타일 지정
  - 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'cancel' 중 택 1
  - 기본값은 'primary'
- `btnSize`: 버튼의 사이즈 지정
  - 'small' | 'medium' | 'large' 중 택 1
  - 기본값은 'medium'
- `btnIcon`: 버튼의 아이콘 지정
  - ReactNode 타입
  - 예시: `btnIcon={<img src={DownloadIcon} alt="다운로드 아이콘" />}`
- `btnText`: 버튼의 텍스트 지정
  - string 타입
- `iconOnly`: 아이콘만 있는 버튼의 경우 필수 기재
  - boolean 타입
  - iconOnly 적용 시 btnText는 쓰지 말 것
  - 적으면 true, 안 쓰면 false
- `className`: 버튼 스타일 커스터마이징
  - string 타입
  - tailwindcss 클래스로 작성
  - 본 커스텀 스타일의 적용 우선순위가 가장 높음
- `onClick`: 버튼 클릭 시 수행할 로직 지정
  - HTMLButtonElement의 onClick을 상속
- `disabled`: 버튼의 활성화 여부 지정
  - boolean 타입
  - 적으면 true, 안 쓰면 false

---

## ℹ️ 참고 사항

- 아이콘 에셋 파일은 `@assets/icons/` 안에 저장해 주세요.
- 형식은 `.svg`를 권장드립니다.
- 더 많은 Button 사용 예시는 `@src/test-pages/ButtonTest.tsx`의 코드를 참고해 주세요.
