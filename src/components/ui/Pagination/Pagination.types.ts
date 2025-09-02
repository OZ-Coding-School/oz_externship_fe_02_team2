export type PaginationProps = {
  totalPages: number
  currentPage: number
  onChange: (page: number) => void
  className?: string
}
