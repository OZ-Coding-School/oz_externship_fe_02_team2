export default function Description({
  children,
  id,
}: {
  children: React.ReactNode
  id?: string
}) {
  return (
    <p id={id} className="text-base-content/70 mb-4">
      {children}
    </p>
  )
}
