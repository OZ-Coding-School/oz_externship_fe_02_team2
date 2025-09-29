import { setupWorker } from 'msw/browser'
import {
  usersHandlers,
  withdrawalHandlers,
  studyGroupHandlers,
  recruitmentHandlers,
} from './handlers'

export const worker = setupWorker(
  ...usersHandlers,
  ...withdrawalHandlers,
  ...studyGroupHandlers,
  ...recruitmentHandlers
)
