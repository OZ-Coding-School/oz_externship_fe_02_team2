export type InputSize = 'sm' | 'md' | 'lg'
export type InputType = 'text' | 'email' | 'password' | 'number'

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  // 컴포에서 제어 또는 계산하는 것들은 제외
  | 'size'
  | 'type'
  | 'aria-invalid'
  | 'aria-describedby'
  | 'value'
  | 'defaultValue'
  | 'onChange'
>

export type ControlledValue = string | number | readonly string[]

export interface CommonInputProps extends NativeInputProps {
  /** 라벨 텍스트 (없으면 라벨 미표시) */
  label?: string
  /** 입력 타입 */
  type?: InputType
  /** 에러 메시지 (문자열 전달 시 에러 스타일 활성화) */
  error?: string
  /** 보조 설명 텍스트 (에러 미존재 시에만 표시) */
  helper?: string
  /** 사이즈 변형 */
  size?: InputSize
  /** 외곽 컨테이너 클래스 */
  containerClassName?: string
  /** 인풋 클래스 */
  className?: string
  /** 좌측 아이콘 슬롯 */
  leftIcon?: React.ReactNode
  /** 우측 아이콘 슬롯 (비번 토글보다 우선순위 낮음) */
  rightIcon?: React.ReactNode
  /** 비밀번호 토글 버튼 표시 여부 (type=password 일 때만 의미 있음) */
  showPasswordToggle?: boolean
  /** 클리어 버튼 표시 (value가 있고 !disabled 일 때만 표시) */
  clearable?: boolean
}

/** 분기: controlled */
export type ControlledProps = CommonInputProps & {
  value: ControlledValue
  onChange: React.ChangeEventHandler<HTMLInputElement>
  defaultValue?: never
}

/** 분기: uncontrolled */
export type UncontrolledProps = CommonInputProps & {
  defaultValue?: string | number | readonly string[]
  value?: never
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export type InputProps = ControlledProps | UncontrolledProps
