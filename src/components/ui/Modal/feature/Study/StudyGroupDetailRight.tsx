import CourseCard from './CourseCard'
import MemberList from './MemberList'
import type { Course, Member } from './Study.types'

type Props = {
  members?: Member[]
  courses?: Course[]
  loading?: boolean
}

export default function StudyGroupDetailRight({
  members,
  courses,
  loading,
}: Props) {
  if (loading) {
    return (
      <aside className="space-y-5">
        <div className="h-6 w-28 animate-pulse rounded bg-gray-200" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-6 w-28 animate-pulse rounded bg-gray-200" />
        <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
      </aside>
    )
  }

  return (
    <aside className="space-y-5">
      <div className="space-y-2">
        <div className="text-xs text-gray-500">멤버 목록</div>
        <MemberList members={members ?? []} maxHeightClass="max-h-80" />
      </div>

      <div className="space-y-2">
        <div className="text-xs text-gray-500">스터디 강의 목록</div>
        {courses && courses.length > 0 ? (
          <div className="space-y-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-500">
            연관 강의가 없습니다.
          </div>
        )}
      </div>
    </aside>
  )
}
