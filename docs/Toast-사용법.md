# Toast 알림 메시지 사용법

작성자: 함서연

## 📌 개요

Zustand 사용하여 만든 전역 토스트 알림 메시지를 사용(trigger)하는 방법에 대해 정리했습니다.

---

## 🛠 사용 방법

```tsx
// 1. useToast를 import 합니다.
import { useToast } from '@/hooks'

// 2. 사용하고자 하는 컴포넌트 함수 내부에서 useToast를 호출하여 triggerToast 함수를 꺼내옵니다.
const { triggerToast } = useToast()

// 3. 토스트 알림이 발생해야 하는 곳에서 triggerToast를 호출, arguments를 전달합니다. (type 전달은 필수!)
triggerToast(type, title, content)
```

- `type`: [필수 입력] 토스트 알림 종류('info' | 'success' | 'warning' | 'error' 중 택 1)
- `title`: [선택 입력] 토스트 알림 제목 (기본값은 피그마와 동일)
- `content`: [선택 입력] 토스트 알림 내용 (기본값은 피그마와 동일)

### 예시 코드

```tsx
const { triggerToast } = useToast()

return (
  <Button
    btnStyle="success"
    btnSize="medium"
    btnText="성공 토스트 알림"
    onClick={() => triggerToast('success', '성공', '정상 처리되었습니다.')}
  />
)
```

---

## ℹ️ 참고 사항

- `ToastContainer`는 반드시 전역에서 렌더링해야 합니다. (현재 `main.tsx`에 위치)
- 토스트는 3초 후 자동으로 닫히게 설정했습니다. 시간은 `useToast.ts`에서 `TIMEOUT` 상수로 조절할 수 있습니다.
- 중복 알림 방지를 위해 난수 처리로 id를 생성하고 있습니다: `Date.now() * 10000 + Math.floor(Math.random() * 10000)`
