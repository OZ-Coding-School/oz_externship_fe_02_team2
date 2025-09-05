export default function Title({
  children,
  id,
}: {
  children: React.ReactNode
  id?: string
}) {
  return (
    <h4 id={id} className="mb-2 font-bold">
      {children}
    </h4>
  )
}
