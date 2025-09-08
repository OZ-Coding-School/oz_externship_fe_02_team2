export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="body-sm flex items-center justify-between px-6 py-4 font-medium">
      {children}
    </div>
  )
}
