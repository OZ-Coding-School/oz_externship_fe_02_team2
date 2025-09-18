import { useLocation } from 'react-router-dom'
import { getPageTitle } from '../../lib/getPageString'

/** 라우팅 테스트용 임시 페이지 */
export default function PlaceHolderPage() {
  const { pathname } = useLocation()

  return (
    <section>
      <h3 className="hidden md:block">{getPageTitle(pathname)}</h3>
    </section>
  )
}
