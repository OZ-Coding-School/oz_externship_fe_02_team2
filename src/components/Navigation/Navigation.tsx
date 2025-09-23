import { Actionbar } from './Actionbar'
import { Sidebar } from './Sidebar'

type NavigationProps = {
  onActionbarMenuClick: () => void
  actionbarTitle: string
  mobileDrawerOpen: boolean
  onMobileDrawerOpenChange: () => void
}

export default function Navigaiton({
  onActionbarMenuClick,
  actionbarTitle,
  mobileDrawerOpen,
  onMobileDrawerOpenChange,
}: NavigationProps) {
  return (
    <>
      {/* 모바일 전용 액션바: 페이지 컬럼 내부에만 보임 */}
      <Actionbar onMenuClick={onActionbarMenuClick} title={actionbarTitle} />
      <Sidebar
        mobileDrawerOpen={mobileDrawerOpen}
        onMobileDrawerOpenChange={onMobileDrawerOpenChange}
      />
    </>
  )
}
