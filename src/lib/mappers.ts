export type Tone = 'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'gray'

export const roleToTone = (role?: string): Tone => {
  if (role === '관리자') return 'purple'
  if (role === '스태프') return 'blue'
  return 'gray' // 일반회원 등
}
