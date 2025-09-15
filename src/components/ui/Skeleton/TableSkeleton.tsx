import Skeleton from './Skeleton'

export function TableSkeleton({
  rows = 6,
  cols = 5,
}: {
  rows?: number
  cols?: number
}) {
  return (
    <Skeleton.Container className="w-full">
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid grid-cols-5 gap-4 py-3">
            {Array.from({ length: cols }).map((__, c) => (
              <Skeleton.Block key={c} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </Skeleton.Container>
  )
}
