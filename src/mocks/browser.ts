import { setupWorker } from 'msw/browser'
import { usersHandlers } from './handlers'

export const worker = setupWorker(...usersHandlers)
