import { setupWorker } from 'msw/browser'
import {
  usersHandlers,
  withdrawalHandlers,
  studyGroupHandlers,
  recruitmentHandlers,
  applyToStudyHandlers,
} from './handlers'

export const worker = setupWorker(
  ...usersHandlers,
  ...withdrawalHandlers,
  ...studyGroupHandlers,
  ...recruitmentHandlers,
  ...applyToStudyHandlers
)
