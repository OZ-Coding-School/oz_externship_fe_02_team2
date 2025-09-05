export default function Title({
  children,
  id,
}: {
  children: React.ReactNode
  id?: string
}) {
  return (
    <h2 id={id} className="mb-2 text-xl font-semibold">
      {children}
    </h2>
  )
}
