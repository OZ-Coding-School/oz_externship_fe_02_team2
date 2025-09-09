import Accordion from '@/components/ui/Accordion/Accordion'

export default function AccordionTest() {
  return (
    <section className="h-screen space-y-4 p-6">
      <h3>Accordion 컴포넌트 테스트</h3>
      <p className="body-sm">
        사이드바 기준으로 디자인 작업한, 아코디언 컴포넌트의 테스트
        페이지입니다.
      </p>
      <Accordion />
    </section>
  )
}
