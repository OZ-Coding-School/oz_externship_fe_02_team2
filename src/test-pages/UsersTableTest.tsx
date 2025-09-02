import { useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'

import UsersTable, { type UserRow } from '@components/table/feature/UsersTable'
import CoursesTable, {
  type CourseRow,
} from '@components/table/feature/CoursesTable'
import WithdrawalsTable, {
  type WithdrawalRow,
} from '@components/table/feature/withdrawalsTable'
import StudyGroupsTable, {
  type StudyGroupRow,
} from '@components/table/feature/StudyGrouptsTable'

type TabKey = 'users' | 'withdrawals' | 'courses' | 'studygroups'

export default function AdminTablesTest() {
  const [tab, setTab] = useState<TabKey>('users')

  // --- 더미 데이터 (API 연결 전 테스트용) ---
  const userRows = useMemo<UserRow[]>(
    () => [
      {
        memberId: '1',
        email: 'alice@example.com',
        nickname: '앨리스',
        name: 'Alice',
        birth: '1992-01-01',
        role: '관리자',
        status: '활성',
        joinedAt: '2025-08-01T10:10:00Z',
      },
      {
        memberId: '2',
        email: 'bob@example.com',
        nickname: '밥',
        name: 'Bob',
        birth: '1995-05-05',
        role: '일반회원',
        status: '정지',
        joinedAt: '2025-08-02T12:30:00Z',
      },
      {
        memberId: '3',
        email: 'cathy@example.com',
        nickname: '캐시',
        name: 'Cathy',
        birth: '1990-12-24',
        role: '스태프',
        status: '탈퇴요청',
        joinedAt: '2025-08-03T09:00:00Z',
        withdrawnAt: '2025-08-30T09:00:00Z',
      },
    ],
    []
  )

  const withdrawalRows = useMemo<WithdrawalRow[]>(
    () => [
      {
        wid: 'w-101',
        email: 'dan@example.com',
        name: '단',
        role: '일반회원',
        birth: '1993-03-03',
        reason: '서비스 미이용',
        withdrawnAt: '2025-08-20T14:20:00Z',
      },
      {
        wid: 'w-102',
        email: 'erin@example.com',
        name: '에린',
        role: '스태프',
        reason: '기타',
        withdrawnAt: '2025-08-22T09:00:00Z',
      },
    ],
    []
  )

  const courseRows = useMemo<CourseRow[]>(
    () => [
      {
        id: 11,
        title: 'React Query 마스터',
        instructor: '김코딩',
        platform: 'Inflearn',
        openedAt: '2025-07-10T11:00:00Z',
        completedAt: '2025-08-01T11:00:00Z',
        thumbnail: 'https://picsum.photos/80?1',
        link: '#',
      },
      {
        id: 12,
        title: 'TypeScript 심화',
        instructor: '이개발',
        platform: 'Udemy',
        openedAt: '2025-07-20T11:00:00Z',
        thumbnail: 'https://picsum.photos/80?2',
      },
    ],
    []
  )

  const groupRows = useMemo<StudyGroupRow[]>(
    () => [
      {
        id: 201,
        title: '알고리즘 스터디',
        capacity: 6,
        enrolled: 5,
        period: { start: '2025-08-01', end: '2025-09-30' },
        status: '진행중',
        createdAt: '2025-07-25T09:00:00Z',
        updatedAt: '2025-08-20T18:00:00Z',
        cover: 'https://picsum.photos/120/80?3',
      },
      {
        id: 202,
        title: 'CS 기본기',
        capacity: 8,
        enrolled: 8,
        period: { start: '2025-06-01', end: '2025-07-31' },
        status: '종료됨',
        createdAt: '2025-05-20T09:00:00Z',
        updatedAt: '2025-07-31T18:00:00Z',
      },
      {
        id: 203,
        title: '영어 회화',
        capacity: 4,
        enrolled: 1,
        period: { start: '2025-09-01', end: '2025-10-15' },
        status: '대기중',
        createdAt: '2025-08-25T09:00:00Z',
        updatedAt: '2025-08-27T18:00:00Z',
      },
    ],
    []
  )

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <h1 className="mb-4 text-xl font-bold">Admin Tables (Test)</h1>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as TabKey)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">회원 관리</TabsTrigger>
          <TabsTrigger value="withdrawals">회원 탈퇴 관리</TabsTrigger>
          <TabsTrigger value="courses">강의 관리</TabsTrigger>
          <TabsTrigger value="studygroups">스터디 그룹 관리</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="users">
            <UsersTable
              rows={userRows}
              total={userRows.length}
              loading={false}
            />
          </TabsContent>

          <TabsContent value="withdrawals">
            <WithdrawalsTable
              rows={withdrawalRows}
              total={withdrawalRows.length}
              loading={false}
            />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesTable
              rows={courseRows}
              total={courseRows.length}
              loading={false}
            />
          </TabsContent>

          <TabsContent value="studygroups">
            <StudyGroupsTable
              rows={groupRows}
              total={groupRows.length}
              loading={false}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
