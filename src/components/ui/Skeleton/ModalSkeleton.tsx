import Skeleton from './Skeleton'

export default function ModalSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <Skeleton.Container className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton.Circle size={72} />
        <div className="w-full max-w-md space-y-2">
          <Skeleton.Text lines={1} widths={[40]} size="lg" />
          <Skeleton.Text lines={1} widths={[70]} size="sm" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton.Text lines={1} widths={[30]} size="sm" tone="subtle" />
            <Skeleton.Block className="h-10 w-full" rounded="md" />
          </div>
        ))}
      </div>
    </Skeleton.Container>
  )
}
