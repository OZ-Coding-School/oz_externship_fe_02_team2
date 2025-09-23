import { usersDb } from './seeds/users.seed'

// 기존 db.users 대신 usersDb를 사용
export const db = {
  get users() {
    return usersDb.users
  },
  set users(value) {
    usersDb.users = value
  },
}
