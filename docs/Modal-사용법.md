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
  - 조합형(Headless 스타일) 모달: Modal 본체 + Header/Title/Description/Body/Footer/Actions 파츠 제공
  - 접근성(A11y) 내장: role="dialog", ESC/백드롭 닫기, 포커스 트랩, body 스크롤 락
  - `Modal` → 위 두 가지를 합쳐서 기본 모달 구조 제공

---

## 2. 기본 사용법

```tsx
import { useState } from 'react'
import Modal from '@components/ui/Modal/Modal'
import { Button } from '@components/ui/Button'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>모달 열기</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="프로필 편집"
        size="lg" // xs~full
        placement="center" // center | top
        closeOnBackdrop
        closeOnEsc
      >
        <Modal.Header>프로필</Modal.Header>
        <Modal.Title>닉네임 변경</Modal.Title>
        <Modal.Description>
          공개 프로필에 표시되는 이름을 수정합니다.
        </Modal.Description>

        <Modal.Body scroll>
          <input className="input input-bordered w-full" placeholder="닉네임" />
        </Modal.Body>

        <Modal.Footer align="end">
          <Modal.Actions>
            <Button onClick={() => setOpen(false)}>취소</Button>
            <Button btnStyle="primary" onClick={() => setOpen(false)}>
              저장
            </Button>
          </Modal.Actions>
        </Modal.Footer>
      </Modal>
    </>
  )
}
```

## 3. 기초 예제

```tsx
<Section title="기본 (center)">
  <Button btnText="열기" onClick={() => setOpenBasic(true)} />
  <Modal
    open={openBasic}
    onClose={() => setOpenBasic(false)}
    title="기본 모달"
    size="lg"
  >
    <Modal.Description>
      포커스 트랩, ESC/백드롭 닫기, 스크롤 락 등 기본 동작을 확인하세요.
    </Modal.Description>
    <Modal.Body>
      <p className="mb-4">
        키보드 <kbd className="kbd">Tab</kbd> 으로 포커스 이동을 확인할 수
        있습니다.
      </p>
      <div className="flex gap-2">
        <Button btnText="버튼 A" />
        <Button btnText="버튼 B" />
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button btnText="닫기" onClick={() => setOpenBasic(false)} />
    </Modal.Footer>
  </Modal>
</Section>
```
