import { PAGE_TITLE } from '@/routes/constants'

export default function DashboardPage() {
  return (
    <section>
      <h3 className="hidden md:block">{PAGE_TITLE.DASHBOARD}</h3>
    </section>
  )
}
