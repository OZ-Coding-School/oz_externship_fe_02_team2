- 공용 모달 컴포넌트 (접근성 + 조합형)
- - 12종 이상의 모달 유형(상세, 확인, 선택, 필터 등)에 대응
- - 포커스 트랩, ESC/백드롭 닫기, body 스크롤 락, portal 적용
- - Header/Body/Footer/Actions 등 서브 컴포넌트 제공
- - 사이즈/위치/zIndex/애니메이션 props로 커스터마이징 가능

# 📌 Modal 사용 가이드

## 1. 개요

모달은 화면 중앙에 콘텐츠를 띄우고, 배경 스크롤을 잠그며, ESC 키나 배경 클릭으로 닫히도록 구성되어 있습니다.  
구현은 다음과 같은 파트로 나뉩니다:

- **훅 (hooks)**
  - `useBodyScrollLock(active: boolean)` → 모달 열렸을 때 body 스크롤 막기
  - `useEscClose(enabled: boolean, onClose: () => void)` → ESC 키로 닫기
  - `useFocusTrap(active: boolean, ref, initialFocus?)` → 모달 내부 포커스 트랩
- **레이아웃 컴포넌트**
  - `ModalOverlay` → 배경 어둡게 (dimmed layer)
  - `ModalContent` → 실제 모달 UI 컨테이너
  - `Modal` → 위 두 가지를 합쳐서 기본 모달 구조 제공

---

## 2. 기본 사용법

```tsx
import { useState } from 'react'
import Modal, { ModalOverlay, ModalContent } from '@/components/common/Modal'

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>모달 열기</button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <ModalOverlay onClick={() => setOpen(false)} />

          <ModalContent>
            <h2 className="text-lg font-semibold">모달 제목</h2>
            <p className="mt-2 text-gray-600">모달 본문이 여기에 들어갑니다.</p>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}
```
