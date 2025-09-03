/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useId, useMemo, useState } from 'react'
import type { InputProps } from '@/types/input'
import { sizeMap, baseInput, errorInput, labelCls } from './Input.styles'
import { EyeIcon, EyeOffIcon, XIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    id,
    label,
    type = 'text',
    error,
    helper,
    size = 'md',
    className = '',
    containerClassName = '',
    leftIcon,
    rightIcon,
    showPasswordToggle = true,
    clearable = false,
    disabled,
    required,
    // controlled/uncontrolled 분기용
    value,
    defaultValue,
    onChange,
    ...rest
  } = props

  const autoId = useId()
  const inputId = id ?? `inp-${autoId}`
  const msgId = `${inputId}-desc`
  const hasError = Boolean(error && error.trim().length)

  const isControlled = (value as unknown) !== undefined

  const currentValue = useMemo(() => {
    const v = isControlled ? (value as any) : defaultValue
    return (v ?? '') as string | number | readonly string[]
  }, [isControlled, value, defaultValue])

  const sizeCls = sizeMap[size]

  // 아이콘이 있거나 패스워드 토글이 있으면 오른쪽 패딩 확보
  const needsRightPad = !!(
    leftIcon ||
    rightIcon ||
    (type === 'password' && showPasswordToggle)
  )

  const [showPw, setShowPw] = useState(false)
  const inputType =
    type === 'password' && showPasswordToggle
      ? showPw
        ? 'text'
        : 'password'
      : type

  const describedBy = hasError || helper ? msgId : undefined

  // value/defaultValue 혼용 방지
  const inputValueProps = isControlled
    ? { value, onChange }
    : { defaultValue, onChange }

  return (
    <div className={cn('flex flex-col', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className={cn(labelCls, sizeCls.label)}>
          {label}
          {required && <span className="text-danger-600 ml-0.5">*</span>}ㄴ
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          ref={ref}
          type={inputType}
          className={cn(
            baseInput,
            sizeCls.input,
            leftIcon && 'pl-9',
            needsRightPad && 'pr-10',
            hasError && errorInput,
            className
          )}
          aria-describedby={describedBy}
          disabled={disabled}
          required={required}
          {...inputValueProps}
          {...rest}
        />

        {/* clear 버튼 */}
        {clearable && !disabled && String(currentValue).length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              const node =
                (e.currentTarget.previousSibling as HTMLInputElement) ?? null
              if (!node) return
              const setter = Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                'value'
              )?.set
              setter?.call(node, '')
              node.dispatchEvent(new Event('input', { bubbles: true }))
              node.focus()
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-2"
            aria-label="입력 지우기"
            tabIndex={-1}
          >
            <XIcon />
          </button>
        )}

        {/* 비밀번호 토글 / 우측 아이콘 */}
        {type === 'password' && showPasswordToggle ? (
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className={cn(
              // clearable이면 clear 버튼이 차지하는 공간만큼 왼쪽으로 한 칸
              `absolute inset-y-0 ${clearable ? 'right-8' : 'right-0'} flex items-center pr-3`
            )}
            aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 표시'}
            tabIndex={-1}
          >
            {showPw ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : (
          rightIcon && (
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </span>
          )
        )}
      </div>

      {(hasError || helper) && (
        <p
          id={msgId}
          className={cn(
            sizeCls.msg,
            hasError ? 'text-danger-600' : 'text-muted-text dark:text-gray-400'
          )}
        >
          {hasError ? error : helper}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
