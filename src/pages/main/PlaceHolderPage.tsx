import { useLocation } from 'react-router'

/** 라우팅 테스트용 임시 페이지 */
export default function PlaceHolderPage() {
  const { pathname } = useLocation()

  return (
    <section>
      <h1>{pathname}</h1>
    </section>
  )
}
