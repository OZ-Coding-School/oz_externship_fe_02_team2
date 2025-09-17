import { User } from 'lucide-react'
import type { Member } from './Study.types'
import Badge from '@/components/ui/Badge/Badge'

type MemberListProps = {
  members: Member[]
  maxHeightClass?: string // 예: "max-h-80"
}

export default function MemberList({
  members,
  maxHeightClass = 'max-h-80',
}: MemberListProps) {
  return (
    <div className="space-y-2">
      {/* 큰 카드 컨테이너 */}
      <section
        aria-label="스터디 멤버 목록"
        className={`rounded-2xl border border-gray-200 bg-gray-50 p-3 ${maxHeightClass} overflow-auto`}
      >
        <ul role="list" className="space-y-2">
          {members.map((m) => (
            <li key={m.id}>
              {/* 개별 멤버 카드 */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm hover:bg-gray-50">
                <div className="flex min-w-0 items-center gap-2">
                  <User className="size-6 text-gray-400" aria-hidden="true" />
                  <span className="truncate text-sm text-gray-800">
                    {m.name}
                  </span>
                </div>

                {m.isLeader && (
                  <Badge tone="yellow" size="sm" className="shrink-0">
                    리더
                  </Badge>
                )}
              </div>
            </li>
          ))}

          {members.length === 0 && (
            <li>
              <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
                등록된 멤버가 없습니다.
              </div>
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}
