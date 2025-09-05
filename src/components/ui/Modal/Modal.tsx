import React, { useRef } from 'react'
import { createPortal } from 'react-dom'

import { sizeToClass, placementToClass } from './constants'
import type { ModalProps } from '@/types'
import { ensurePortalRoot } from '@/lib/portalRoot'
import { useBodyScrollLock, useEscClose, useFocusTrap } from '@/hooks'
import Header from './parts/Header'
import Title from './parts/Title'
import Description from './parts/Description'
import Body from './parts/Body'
import Footer from './parts/Footer'
import Actions from './parts/Action'
import { Button } from '../Button'

function Modal({
  open,
  onClose,
  children,
  title,
  describedById,
  closeOnBackdrop = true,
  closeOnEsc = true,
  initialFocus,
  size = 'lg',
  placement = 'center',
  maxHeightClass = 'max-h-[80vh]',
  className = '',
  zIndex = 1000,
  showCloseIcon = true,
  backdropClassName,
}: ModalProps) {
  const root = typeof window !== 'undefined' ? ensurePortalRoot() : null
  const panelRef = useRef<HTMLDivElement>(null)

  useBodyScrollLock(open)
  useEscClose(open && closeOnEsc, onClose)
  useFocusTrap(open, panelRef, initialFocus)

  if (!open || !root) return null

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdrop) return
    if (e.target === e.currentTarget) onClose()
  }

  return createPortal(
    <div
      className={`fixed inset-0 flex ${placementToClass[placement]} justify-center z-[${zIndex}]`}
      onMouseDown={onBackdrop}
    >
      {/* Backdrop */}
      <div
        className={
          backdropClassName ??
          // 투명도 있는 어두운 오버레이 (DaisyUI 미사용)
          'absolute inset-0 bg-[rgba(0,0,0,0.5)]'
        }
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={describedById || undefined}
        ref={panelRef}
        className={[
          'relative z-[1] w-full',
          sizeToClass[size],
          size !== 'full' ? 'mx-4' : '',
          'rounded-2xl bg-white', // 흰색 배경
          'text-primary-text)]', // 전역 텍스트 컬러
          'border-gray-300)] border', // 경계선
          'shadow-[0_12px_40px_rgba(0,0,0,0.18)]', // 부드러운 그림자
          size !== 'full' ? maxHeightClass : '',
          'transition-transform duration-200 ease-out',
          className,
        ].join(' ')}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {showCloseIcon && (
          <Button
            aria-label="닫기"
            btnText="x"
            onClick={onClose}
            className="absolute top-3 right-3"
          />
        )}

        <div className="overflow-hidden p-6">
          {title && (
            // 전역 h2 유틸(@utility h2) 있으니 그대로 사용,
            // 여기선 여백만 추가
            <h2 id="modal-title" className="h2 mb-4">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>,
    root
  )
}

// 조합형 API
Modal.Header = Header
Modal.Title = Title
Modal.Description = Description
Modal.Body = Body
Modal.Footer = Footer
Modal.Actions = Actions

export default Modal
