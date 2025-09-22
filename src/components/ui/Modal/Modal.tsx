import React, { useRef } from 'react'
import { createPortal } from 'react-dom'
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
import CloseIcon from '@assets/icons/close_g.svg'
import { cn } from '@/lib'
import { PLACEMENT_CLASS, SIZE_CLASS } from './constants'
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
      className={`fixed inset-0 flex ${PLACEMENT_CLASS[placement]} z-90 justify-center`}
      onMouseDown={onBackdrop}
    >
      {/* Backdrop */}
      <div
        className={
          backdropClassName ??
          // 투명도 있는 어두운 오버레이
          'absolute inset-0 bg-gray-600/50'
        }
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={describedById || undefined}
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'text-primary-text relative z-[1] flex w-full flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-transform duration-200 ease-out',
          SIZE_CLASS[size],
          size !== 'full' && maxHeightClass,
          className
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {showCloseIcon && (
          <Button
            btnSize="small"
            btnIcon={<img src={CloseIcon} alt="닫기 아이콘" />}
            className="absolute top-3 right-3 rounded-full bg-transparent p-2 hover:bg-gray-100 focus-visible:ring-2 active:bg-gray-200"
            iconOnly
            onClick={onClose}
          />
        )}
        <div className="flex h-full flex-col overflow-hidden">{children}</div>
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
