export default function Description({
  children,
  id,
}: {
  children: React.ReactNode
  id?: string
}) {
  return (
    <p id={id} className="mb-4">
      {children}
    </p>
  )
}
