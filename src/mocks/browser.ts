import { setupWorker } from 'msw/browser'
import {
  usersHandlers,
  withdrawalHandlers,
  studyGroupHandlers,
  recruitmentHandlers,
} from './handlers'
import { applyToStudyHandlers } from '@/components/table/feature/ApplyToStudy/applyToStudy.handlers'

export const worker = setupWorker(
  ...usersHandlers,
  ...withdrawalHandlers,
  ...studyGroupHandlers,
  ...recruitmentHandlers,
  ...applyToStudyHandlers
)
