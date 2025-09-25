import { setupWorker } from 'msw/browser'
import { usersHandlers } from './handlers'
import { recruitmentHandlers } from '@/api/modules/recruitments'

export const worker = setupWorker(...usersHandlers, ...recruitmentHandlers)
