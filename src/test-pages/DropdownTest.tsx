import Dropdown from '@/components/ui/Dropdown/Dropdown'
import type { Option } from '@/components/ui/Dropdown/Dropdown.types'
import { useState } from 'react'

const STUDY_STATUS: readonly Option[] = [
  { value: 'ALL', label: '전체' },
  { value: 'IN_PROGRESS', label: '진행 중' },
  { value: 'PENDING', label: '대기중' },
  { value: 'ENDED', label: '종료됨' },
] as const

const POST_STATUS: readonly Option[] = [
  { value: 'ALL', label: '전체' },
  { value: 'OPEN', label: '모집 중' },
  { value: 'CLOSED', label: '마감', disabled: false },
] as const

export default function DropDownTest() {
  // Controlled 예시
  const [studyStatus, setStudyStatus] = useState<string | null>('ALL')
  const [postStatus, setPostStatus] = useState<string | null>('OPEN')

  // 로그(최근 6개)
  const [logs, setLogs] = useState<string[]>([])
  const pushLog = (msg: string) => setLogs((prev) => [msg, ...prev].slice(0, 6))

  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold">Dropdown 데모</h1>

      {/* 1) Controlled - 스터디 상태 (align=start) */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">1) Controlled - 스터디 상태</h2>
        <div className="flex items-center gap-3">
          <Dropdown
            options={STUDY_STATUS}
            value={studyStatus}
            onChange={(v, o) => {
              setStudyStatus(v)
              pushLog(`[Study] ${o.label}(${v}) 선택`)
            }}
            placeholder="상태 선택"
            align="start"
            classes={{
              button: 'h-9 w-48',
              menu: 'max-h-72',
            }}
          />
          <div className="text-sm text-gray-600">
            현재 값:{' '}
            <span className="font-semibold">{studyStatus ?? '(null)'}</span>
          </div>
        </div>
      </section>

      {/* 2) Controlled - 공고 상태 (align=end) */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          2) Controlled - 공고 상태 (align="end")
        </h2>
        <div className="flex items-center gap-3">
          <Dropdown
            options={POST_STATUS}
            value={postStatus}
            onChange={(v, o) => {
              setPostStatus(v)
              pushLog(`[Post] ${o.label}(${v}) 선택`)
            }}
            placeholder="공고 상태"
            align="end"
            classes={{ button: 'h-9 w-48' }}
          />
          <div className="text-sm text-gray-600">
            현재 값:{' '}
            <span className="font-semibold">{postStatus ?? '(null)'}</span>
          </div>
        </div>
      </section>

      {/* 3) Uncontrolled - defaultValue만 사용하는 간단 버전 */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">3) Uncontrolled - defaultValue</h2>
        <Dropdown
          options={STUDY_STATUS}
          defaultValue="PENDING"
          onChange={(v, o) => pushLog(`[Uncontrolled] ${o.label}(${v}) 선택`)}
          classes={{ button: 'h-9 w-48' }}
        />
        <p className="text-sm text-gray-500">
          내부 상태로만 동작. 외부 useState 없이도 한 번 선택하면 값 유지됨.
        </p>
      </section>

      {/* 4) Disabled 예시 */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">4) Disabled</h2>
        <div className="flex items-center gap-3">
          <Dropdown
            options={POST_STATUS}
            value="CLOSED"
            onChange={() => {}}
            disabled
            classes={{ button: 'h-9 w-48' }}
          />
          <span className="text-sm text-gray-500">
            비활성 상태(클릭/열기 불가)
          </span>
        </div>
      </section>

      {/* 이벤트 로그 */}
      <section className="space-y-2">
        <h3 className="text-base font-semibold">이벤트 로그</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {logs.length === 0 ? (
            <li className="text-gray-400">아직 로그 없음</li>
          ) : (
            logs.map((l, i) => <li key={i}>{l}</li>)
          )}
        </ul>
      </section>
    </div>
  )
}
