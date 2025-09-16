import { Button } from '@/components/ui/Button'
import Modal from '../../Modal'
import type { StudyGroupDetail } from './Study.types'
import StudyGroupDetailLeft from './StudyGroupDetailLeft'
import StudyGroupDetailRight from './StudyGroupDetailRight'

type StudyGroupDetailModalProps = {
  open: boolean
  onClose: () => void
  data?: StudyGroupDetail
  loading?: boolean
  errorText?: string | null
  columnsClassName?: string
}

export default function StudyGroupDetailModal({
  open,
  onClose,
  data,
  loading,
  errorText,
  columnsClassName = `md:grid-cols-[1fr_1fr]`,
}: StudyGroupDetailModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="스터디 그룹 상세 정보"
      size="none"
      className="w-[1024px]"
    >
      <Modal.Header>
        <Modal.Title id="StudyGroup-title">스터디 그룹 상세 정보</Modal.Title>
      </Modal.Header>
      <div className="border-b border-gray-200" />

      <Modal.Body className={`grid gap-6 ${columnsClassName} max-h-[65vh] p-6`}>
        <StudyGroupDetailLeft
          data={data}
          loading={loading}
          errorText={errorText}
        />
        <StudyGroupDetailRight
          members={data?.members}
          courses={data?.courses}
          loading={loading}
        />
      </Modal.Body>
      <div className="border-b border-gray-200" />
      {/* Footer */}
      <Modal.Footer align="end" className="bg-gray-50">
        <Button btnStyle="cancel" btnText="닫기" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  )
}
