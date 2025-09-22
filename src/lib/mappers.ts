import type { StudyGroupRow, UserRow } from '@/components/table/Table.types'

export type Tone = 'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'gray'
export type Variant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'

export const roleToTone = (role?: string): Tone => {
  if (role === '관리자') return 'purple'
  if (role === '스태프') return 'blue'
  return 'gray' // 일반회원 등
}

export const toneToVariant: Record<Tone, Variant> = {
  gray: 'default', // 회색
  blue: 'primary', // 파랑
  green: 'success', // 초록
  red: 'danger', // 빨강
  yellow: 'warning', // 노랑
  purple: 'info', // 보라
}

export const statusToTone: Record<UserRow['status'], Tone> = {
  활성: 'green',
  정지: 'red',
  탈퇴요청: 'yellow',
  비활성: 'gray',
}

export const studyToTone: Record<StudyGroupRow['status'], Tone> = {
  대기중: 'blue',
  진행중: 'green',
  종료됨: 'gray',
}
