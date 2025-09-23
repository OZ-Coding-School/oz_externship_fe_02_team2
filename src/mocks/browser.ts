import { setupWorker } from 'msw/browser'
import { usersHandlers, withdrawalHandlers } from './handlers'

export const worker = setupWorker(...usersHandlers, ...withdrawalHandlers)
