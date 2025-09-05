import { useRef, useState } from 'react'
import Modal from '@components/ui/Modal/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input/Input'

/**
 * ModalTest
 * - 공용 모달 기능 점검용 테스트 페이지
 * - 확인 모달 / 폼 포커스 / 사이즈 / 위치 / 백드롭/ESC 동작 등의 시나리오 제공
 */

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-base-100 mb-8 rounded-2xl border p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      {children}
    </section>
  )
}

export default function ModalTest() {
  // 공통 상태들
  const [openBasic, setOpenBasic] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [openTop, setOpenTop] = useState(false)
  const [openSizes, setOpenSizes] = useState<
    null | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  >(null)

  const firstInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <h2 className="mb-6 text-2xl font-bold">Modal 테스트 페이지</h2>

      {/* 기본 모달 */}
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

      {/* 확인 모달 */}
      <Section title="확인 모달 (Confirm)">
        <Button
          btnText="삭제 확인 띄우기"
          onClick={() => setOpenConfirm(true)}
        />
        <Modal
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          title="삭제하시겠어요?"
          size="sm"
        >
          <Modal.Description>이 작업은 되돌릴 수 없습니다.</Modal.Description>
          <Modal.Footer>
            <Button btnText="취소" onClick={() => setOpenConfirm(false)} />
            <Button
              btnText="삭제"
              onClick={() => {
                alert('삭제됨!')
                setOpenConfirm(false)
              }}
            />
          </Modal.Footer>
        </Modal>
      </Section>

      {/* 폼 + 초기 포커스 */}
      <Section title="폼(초기 포커스)">
        <Button btnText="폼 열기" onClick={() => setOpenForm(true)} />
        <Modal
          open={openForm}
          onClose={() => setOpenForm(false)}
          title="회원 정보 수정"
          size="md"
          initialFocus={() => firstInputRef.current}
        >
          <Modal.Body>
            <div className="grid gap-4">
              <label className="form-control">
                <span className="label-text">이름</span>
                <Input
                  ref={firstInputRef}
                  type="text"
                  className="input input-bordered"
                  placeholder="홍길동"
                />
              </label>
              <label className="form-control">
                <span className="label-text">전화번호</span>
                <Input
                  type="text"
                  className="input input-bordered"
                  placeholder="010-1234-5678"
                />
              </label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button btnText="취소" onClick={() => setOpenForm(false)} />
            <Button btnText="저장" onClick={() => setOpenForm(false)} />
          </Modal.Footer>
        </Modal>
      </Section>

      {/* 상단 배치 */}
      <Section title="상단 배치 (placement='top')">
        <Button btnText="열기" onClick={() => setOpenTop(true)} />
        <Modal
          open={openTop}
          onClose={() => setOpenTop(false)}
          title="상단 모달"
          size="xl"
          placement="top"
        >
          <Modal.Body>
            <p>페이지 상단에서 내려오는 레이아웃을 확인합니다.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button btnText="닫기" onClick={() => setOpenTop(false)} />
          </Modal.Footer>
        </Modal>
      </Section>

      {/* 사이즈 샘플 */}
      <Section title="사이즈 샘플">
        <div className="flex flex-wrap gap-2">
          {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'] as const).map(
            (s) => (
              <Button
                key={s}
                btnText={`size: ${s}`}
                onClick={() => setOpenSizes(s)}
              />
            )
          )}
        </div>

        <Modal
          open={openSizes === 'xs'}
          onClose={() => setOpenSizes(null)}
          title="XS"
          size="xs"
        >
          <Modal.Body>아주 작은 모달</Modal.Body>
          <Modal.Footer>
            <Button btnText="닫기" onClick={() => setOpenSizes(null)} />
          </Modal.Footer>
        </Modal>

        <Modal
          open={openSizes === 'sm'}
          onClose={() => setOpenSizes(null)}
          title="SM"
          size="sm"
        >
          <Modal.Body>작은 모달</Modal.Body>
          <Modal.Footer>
            <Button btnText="닫기" onClick={() => setOpenSizes(null)} />
          </Modal.Footer>
        </Modal>

        <Modal
          open={openSizes === 'md'}
          onClose={() => setOpenSizes(null)}
          title="MD"
          size="md"
        >
          <Modal.Body>중간 모달</Modal.Body>
          <Modal.Footer>
            <Button btnText="닫기" onClick={() => setOpenSizes(null)} />
          </Modal.Footer>
        </Modal>

        <Modal
          open={openSizes === 'lg'}
          onClose={() => setOpenSizes(null)}
          title="LG"
          size="lg"
        >
          <Modal.Body>큰 모달</Modal.Body>
          <Modal.Footer>
            <Button btnText="닫기" onClick={() => setOpenSizes(null)} />
          </Modal.Footer>
        </Modal>

        <Modal
          open={openSizes === 'xl'}
          onClose={() => setOpenSizes(null)}
          title="XL"
          size="xl"
        >
          <Modal.Body>더 큰 모달</Modal.Body>
          <Modal.Footer>
            <Button btnText="닫기" onClick={() => setOpenSizes(null)} />
          </Modal.Footer>
        </Modal>

        <Modal
          open={openSizes === '2xl'}
          onClose={() => setOpenSizes(null)}
          title="2XL"
          size="2xl"
        >
          <Modal.Body>매우 큰 모달</Modal.Body>
          <Modal.Footer>
            <Button btnText="닫기" onClick={() => setOpenSizes(null)} />
          </Modal.Footer>
        </Modal>

        <Modal
          open={openSizes === '3xl'}
          onClose={() => setOpenSizes(null)}
          title="3XL"
          size="3xl"
        >
          <Modal.Body>초대형 모달</Modal.Body>
          <Modal.Footer>
            <Button btnText="닫기" onClick={() => setOpenSizes(null)} />
          </Modal.Footer>
        </Modal>

        <Modal
          open={openSizes === 'full'}
          onClose={() => setOpenSizes(null)}
          title="FULL"
          size="full"
        >
          <Modal.Body>
            <div className="grid gap-4 p-2">
              <p>전체 화면을 차지하는 모달입니다.</p>
              <p>ESC / 백드롭 동작을 확인하세요.</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button btnText="닫기" onClick={() => setOpenSizes(null)} />
          </Modal.Footer>
        </Modal>
      </Section>
    </div>
  )
}
