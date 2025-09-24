import { setupServer } from 'msw/node'
import { usersHandlers, withdrawalHandlers } from './handlers'

export const server = setupServer(...usersHandlers, ...withdrawalHandlers)
