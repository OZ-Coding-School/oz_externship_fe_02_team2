import { useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'

import UsersTable from '@/components/table/feature/Users/UsersTable'
import CoursesTable from '@components/table/feature/CoursesTable'
import WithdrawalsTable from '@/components/table/feature/Withdrawals/withdrawalsTable'
import StudyGroupsTable from '@/components/table/feature/StudyGroups/StudyGroupsTable'
import type {
  CourseRow,
  StudyGroupRow,
  UserRow,
  WithdrawalRow,
} from '@/components/table/Table.types'

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
      {
        memberId: '4',
        email: 'david@example.com',
        nickname: '데이비드',
        name: 'David',
        birth: '1988-07-14',
        role: '일반회원',
        status: '활성',
        joinedAt: '2025-08-04T11:45:00Z',
      },
      {
        memberId: '5',
        email: 'eva@example.com',
        nickname: '에바',
        name: 'Eva',
        birth: '1993-02-19',
        role: '스태프',
        status: '활성',
        joinedAt: '2025-08-05T08:20:00Z',
      },
      {
        memberId: '6',
        email: 'frank@example.com',
        nickname: '프랭크',
        name: 'Frank',
        birth: '1991-09-10',
        role: '일반회원',
        status: '정지',
        joinedAt: '2025-08-06T14:15:00Z',
      },
      {
        memberId: '7',
        email: 'grace@example.com',
        nickname: '그레이스',
        name: 'Grace',
        birth: '1996-11-22',
        role: '관리자',
        status: '활성',
        joinedAt: '2025-08-07T07:30:00Z',
      },
      {
        memberId: '8',
        email: 'henry@example.com',
        nickname: '헨리',
        name: 'Henry',
        birth: '1989-03-03',
        role: '스태프',
        status: '탈퇴요청',
        joinedAt: '2025-08-08T15:00:00Z',
        withdrawnAt: '2025-09-01T15:00:00Z',
      },
      {
        memberId: '9',
        email: 'irene@example.com',
        nickname: '아이린',
        name: 'Irene',
        birth: '1997-06-16',
        role: '일반회원',
        status: '활성',
        joinedAt: '2025-08-09T10:50:00Z',
      },
      {
        memberId: '10',
        email: 'jack@example.com',
        nickname: '잭',
        name: 'Jack',
        birth: '1994-12-01',
        role: '관리자',
        status: '정지',
        joinedAt: '2025-08-10T13:40:00Z',
      },
      {
        memberId: '11',
        email: 'kate@example.com',
        nickname: '케이트',
        name: 'Kate',
        birth: '1990-04-25',
        role: '스태프',
        status: '활성',
        joinedAt: '2025-08-11T09:25:00Z',
      },
      {
        memberId: '12',
        email: 'leo@example.com',
        nickname: '레오',
        name: 'Leo',
        birth: '1992-08-08',
        role: '일반회원',
        status: '활성',
        joinedAt: '2025-08-12T17:05:00Z',
      },
      {
        memberId: '13',
        email: 'mia@example.com',
        nickname: '미아',
        name: 'Mia',
        birth: '1999-10-30',
        role: '일반회원',
        status: '탈퇴요청',
        joinedAt: '2025-08-13T16:00:00Z',
        withdrawnAt: '2025-09-05T16:00:00Z',
      },
      {
        memberId: '14',
        email: 'nick@example.com',
        nickname: '닉',
        name: 'Nick',
        birth: '1987-05-12',
        role: '스태프',
        status: '활성',
        joinedAt: '2025-08-14T11:00:00Z',
      },
      {
        memberId: '15',
        email: 'olivia@example.com',
        nickname: '올리비아',
        name: 'Olivia',
        birth: '1998-07-07',
        role: '관리자',
        status: '활성',
        joinedAt: '2025-08-15T19:30:00Z',
      },
    ],
    []
  )

  const withdrawalRows = useMemo<WithdrawalRow[]>(
    () => [
      {
        id: 101,
        email: 'dan@example.com',
        name: '단',
        permission: '일반회원',
        birthday: '1993-03-03',
        reason: '서비스 미이용',
        created_at: '2025-08-20T14:20:00Z',
      },
      {
        id: 102,
        email: 'erin@example.com',
        name: '에린',
        permission: '스태프',
        reason: '기타',
        created_at: '2025-08-22T09:00:00Z',
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
            <UsersTable rows={userRows} loading={false} />
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
