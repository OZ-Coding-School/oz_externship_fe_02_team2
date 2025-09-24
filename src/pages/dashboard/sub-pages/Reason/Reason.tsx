import { useState } from 'react'
import Section from '../Section'
import { DROPDOWN_REASON_OPTIONS } from '../constants'
import type { DropdownProps } from '@components/ui/Dropdown/Dropdown.types'
import DoughnutChart from '@components/charts/DoughnutChart/DoughnutChart'
import VerticalBarChart from '@components/charts/VerticalBarChart/VerticalBarChart'

export default function Reason() {
  const [reason, setReason] = useState('DISSATISFACTION')

  const dropdownProps: DropdownProps = {
    options: DROPDOWN_REASON_OPTIONS,
    value: reason,
    onChange: (value) => {
      setReason(value)
      // TODO: 드롭다운 변경 시 차트 데이터 바뀌게
    },
    classes: {
      button: 'w-[147px]',
    },
  }

  return (
    <>
      <Section title="탈퇴 사유 분포">
        <DoughnutChart />
      </Section>
      <div className="h-6" />
      <Section title="탈퇴 사유별 월별 추세" dropdown={dropdownProps}>
        <VerticalBarChart />
      </Section>
    </>
  )
}

Reason.Section = Section
