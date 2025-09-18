import type { UserDetail } from '@/components/ui/Modal/feature/User/User.types'

function iso(daysAgo = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

let uid = 1000
function id(prefix: string): string {
  uid += 1
  return `${prefix}_${uid}`
}

export const db = {
  users: [] as UserDetail[],
}

for (let i = 0; i < 64; i++) {
  db.users.push({
    id: id('u'),
    name: `사용자${i}`,
    email: `user${i}@oz.com`,
    gender: i % 5 === 0 ? '기타' : i % 2 === 0 ? '남성' : '여성',
    nickname: `닉${i}`,
    birth: `199${i % 10}-0${(i % 9) + 1}-1${i % 9}`,
    phone: `010-12${i}-56${i}`,
    role: i % 20 === 0 ? '스태프' : i % 37 === 0 ? '관리자' : '일반회원',
    status: i % 17 === 0 ? '비활성' : '활성',
    joinedAt: iso(60 - i),
    avatarUrl: '',
  })
}
