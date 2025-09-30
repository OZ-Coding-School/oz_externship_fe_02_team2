/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import Modal from '../../Modal'
import { Button } from '@/components/ui/Button'
import { getAdminRecruitmentDetail } from '@/api/modules/recruitments'
import RecruitmentDetailLeft from './RecruitmentDetailLeft'
import RecruitmentDetailRight from './RecruitmentDetailRight'
import type { RecruitmentDetailData } from '@/types/AdminRecruitments.types'

interface RecruitmentDetailModalProps {
  open: boolean
  onClose: () => void
  recruitmentId: number | null
}

export default function RecruitmentDetailModal({
  open,
  onClose,
  recruitmentId,
}: RecruitmentDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<RecruitmentDetailData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !recruitmentId) {
      setData(null)
      setError(null)
      return
    }

    const fetchDetail = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getAdminRecruitmentDetail(recruitmentId)
        console.log('API Response:', response)
        setData(response as any)
      } catch (e) {
        setError(
          e instanceof Error ? e.message : '데이터를 불러올 수 없습니다.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [open, recruitmentId])

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="none"
      placement="center"
      className="w-[1152px]"
    >
      <Modal.Header>
        <Modal.Title>스터디 구인 공고 상세 정보</Modal.Title>
      </Modal.Header>

      <div className="border-b border-gray-200" />

      <Modal.Body scroll padded>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
        )}

        {data && (
          <div className="grid grid-cols-2 gap-8">
            {/* 왼쪽 바디 */}
            <div className="border-r border-gray-200 pr-8">
              <RecruitmentDetailLeft data={data} />
            </div>

            {/* 오른쪽 바디 */}
            <div>
              <RecruitmentDetailRight data={data} />
            </div>
          </div>
        )}
      </Modal.Body>

      <div className="border-t border-gray-200" />

      <Modal.Footer className="bg-gray-50">
        <div className="flex w-full justify-between">
          <Button
            btnStyle="danger"
            btnText="삭제하기"
            btnSize="medium"
            onClick={() => {
              if (confirm('정말 삭제하시겠습니까?')) {
                // TODO: 삭제 API 호출
                onClose()
              }
            }}
          />
          <Button
            btnStyle="secondary"
            btnText="닫기"
            btnSize="medium"
            onClick={onClose}
          />
        </div>
      </Modal.Footer>
    </Modal>
  )
}
