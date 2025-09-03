export type Option = { value: string; label: string; disabled?: boolean }

export type DropdownSelectProps = {
  options: readonly Option[]
  value?: string | null
  defaultValue?: string | null
  onChange?: (value: string, option: Option) => void
  placeholder?: string
  disabled?: boolean

  classes?: {
    wrapper?: string
    button?: string
    menu?: string
    option?: string
  }

  align?: 'start' | 'end'
}
