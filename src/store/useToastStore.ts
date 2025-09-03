import type { ToastStore } from '@/types'
import { create } from 'zustand'

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (newToast) =>
    set((state) => ({ toasts: [...state.toasts, newToast] })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))
