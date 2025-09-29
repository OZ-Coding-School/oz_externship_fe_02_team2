import Modal from '../../Modal'
import { Button } from '../../../Button'
import { useEffect } from 'react'
import ApplyToStudyDetailView from './ApplyToStudyDetailView'
import type { ApplyToStudyDetail } from './ApplyToStudy.types'

type Props = {
  open: boolean
  data?: ApplyToStudyDetail | null
  loading?: boolean
  errorText?: string | null
  onClose: () => void
}

export default function ApplyToStudyModal({
  open,
  data,
  loading,
  errorText,
  onClose,
}: Props) {
  // 외부 data 변화 시 추가 동기화가 필요하면 여기서 처리(읽기전용이면 보통 필요 없음)
  useEffect(() => {}, [data])

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="none"
      className="w-[960px]"
      maxHeightClass=""
    >
      <Modal.Header>
        <Modal.Title id="application-title">지원 내역 상세 정보</Modal.Title>
      </Modal.Header>
      <div className="border-b border-gray-200" />

      <Modal.Body className="max-h-[65vh] p-0">
        <ApplyToStudyDetailView
          form={data ?? null}
          loading={loading}
          errorText={errorText}
        />
      </Modal.Body>

      <div className="border-b border-gray-200" />
      <Modal.Footer align="end" className="bg-gray-50">
        <Modal.Actions>
          <Button btnStyle="secondary" btnText="닫기" onClick={onClose} />
        </Modal.Actions>
      </Modal.Footer>
    </Modal>
  )
}
