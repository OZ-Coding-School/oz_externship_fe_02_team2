import { setupWorker } from 'msw/browser'
import { recruitmentHandlers, usersHandlers } from './handlers'

export const worker = setupWorker(...usersHandlers, ...recruitmentHandlers)
