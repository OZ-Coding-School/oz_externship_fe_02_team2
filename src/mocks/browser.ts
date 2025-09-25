import { setupWorker } from 'msw/browser'
import { usersHandlers } from './handlers'
import { recruitmentHandlers } from './handlers'
import { withdrawalHandlers } from './handlers'

export const worker = setupWorker(
  ...usersHandlers,
  ...recruitmentHandlers,
  ...withdrawalHandlers
)
