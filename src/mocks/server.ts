import { setupServer } from 'msw/node'
import { usersHandlers as h } from './handlers'

export const server = setupServer(...h)
