import { setupServer } from 'msw/node'
import {
  usersHandlers,
  withdrawalHandlers,
  studyGroupHandlers,
} from './handlers'

export const server = setupServer(
  ...usersHandlers,
  ...withdrawalHandlers,
  ...studyGroupHandlers
)
