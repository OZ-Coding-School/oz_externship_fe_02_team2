import type { DropdownProps } from '@/components/ui/Dropdown/Dropdown.types'
import Section from '../Section'
import { useState } from 'react'
import { DROPDOWN_PERIOD_OPTIONS } from '../constants'
import VerticalBarChart from '@components/charts/VerticalBarChart/VerticalBarChart'

export default function Join() {
  const [period, setPeriod] = useState('MONTHLY')

  const dropdownProps: DropdownProps = {
    options: DROPDOWN_PERIOD_OPTIONS,
    value: period,
    onChange: (value) => {
      setPeriod(value)
      // TODO: 드롭다운 변경 시 차트 데이터 바뀌게
    },
    classes: {
      button: 'w-23',
    },
  }

  return (
    <Section title="회원가입 추세" dropdown={dropdownProps}>
      <VerticalBarChart />
    </Section>
  )
}

Join.Section = Section
