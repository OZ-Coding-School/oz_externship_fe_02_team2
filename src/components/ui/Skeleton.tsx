export default function Skeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="flex items-center gap-4">
        <div className="size-20 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="h-4 w-56 rounded bg-gray-200" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
