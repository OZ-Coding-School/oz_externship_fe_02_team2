import { useState } from 'react'
import Section from '../common/Section'
import { DROPDOWN_PERIOD_OPTIONS } from '../common/constants'
import type { DropdownProps } from '@components/ui/Dropdown/Dropdown.types'
import VerticalBarChart from '@components/charts/VerticalBarChart/VerticalBarChart'

export default function Leave() {
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
    <Section title="회원탈퇴 추세" dropdown={dropdownProps}>
      <VerticalBarChart type="leave" period={period} />
    </Section>
  )
}

Leave.Section = Section
