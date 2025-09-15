import { useLocation } from 'react-router'
import { getPageTitle } from './main.utils'

/** 라우팅 테스트용 임시 페이지 */
export default function PlaceHolderPage() {
  const { pathname } = useLocation()

  return (
    <section>
      <h2 className="hidden md:block">{`${getPageTitle(pathname)} 페이지`}</h2>
    </section>
  )
}
