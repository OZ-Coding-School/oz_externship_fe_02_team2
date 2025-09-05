export default function Body({
  children,
  id,
  scroll = true,
}: {
  children: React.ReactNode
  id?: string
  scroll?: boolean
}) {
  return (
    <div id={id} className={scroll ? 'max-h-[60vh] overflow-y-auto pr-1' : ''}>
      {children}
    </div>
  )
}
