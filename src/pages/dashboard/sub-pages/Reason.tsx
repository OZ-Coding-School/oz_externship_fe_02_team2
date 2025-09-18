import Section from './Section'

export default function Reason() {
  return (
    <>
      <Section title="탈퇴 사유 분포" />
      <div className="h-6" />
      <Section title="탈퇴 사유별 월별 추세" />
    </>
  )
}

Reason.Section = Section
