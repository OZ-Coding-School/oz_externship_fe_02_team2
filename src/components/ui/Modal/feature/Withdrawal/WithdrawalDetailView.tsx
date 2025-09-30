import WithdrawalUserView from './WithdrawalUserView'
import WithdrawalInfoView from './WithdrawalInfoView'
import type { WithdrawalDetail } from '@type/Withdrawal.types'
import ModalSkeleton from '@/components/ui/Skeleton/ModalSkeleton'

type Props = {
  form?: WithdrawalDetail | null
  loading?: boolean
  errorText?: string | null
}

export default function WithdrawalDetailView({
  form,
  loading,
  errorText,
}: Props) {
  if (loading) {
    return (
      <div className="px-6">
        <ModalSkeleton />
      </div>
    )
  }

  if (errorText) {
    return (
      <div className="px-6">
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorText}
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="px-6">
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          표시할 데이터가 없습니다.
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Section 1: 회원 정보 */}
      <WithdrawalUserView form={form} />

      {/* Section 2: 탈퇴 정보 */}
      <WithdrawalInfoView form={form} />
    </>
  )
}
