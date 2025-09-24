import type { DropdownProps } from '@/components/ui/Dropdown/Dropdown.types'
import Section from '../common/Section'
import { useState } from 'react'
import { DROPDOWN_PERIOD_OPTIONS } from '../common/constants'
import VerticalBarChart from '@components/charts/VerticalBarChart/VerticalBarChart'

export default function Join() {
  const [period, setPeriod] = useState('MONTHLY')

  const dropdownProps: DropdownProps = {
    options: DROPDOWN_PERIOD_OPTIONS,
    value: period,
    onChange: (value) => {
      setPeriod(value)
    },
    classes: {
      button: 'w-23',
    },
  }

  return (
    <Section title="회원가입 추세" dropdown={dropdownProps}>
      <VerticalBarChart type="join" period={period} />
    </Section>
  )
}

Join.Section = Section
