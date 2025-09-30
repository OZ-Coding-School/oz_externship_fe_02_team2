import { setupWorker } from 'msw/browser'
import {
  usersHandlers,
  withdrawalHandlers,
  studyGroupHandlers,
} from './handlers'

export const worker = setupWorker(
  ...usersHandlers,
  ...withdrawalHandlers,
  ...studyGroupHandlers
)
