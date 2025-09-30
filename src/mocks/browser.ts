import { setupWorker } from 'msw/browser'
import {
  usersHandlers,
  withdrawalHandlers,
  studyGroupHandlers,
  applyToStudyHandlers,
} from './handlers'

export const worker = setupWorker(
  ...usersHandlers,
  ...withdrawalHandlers,
  ...studyGroupHandlers,
  ...applyToStudyHandlers
)
