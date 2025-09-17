export default function SortIcon({
  state,
}: {
  state: 'none' | 'asc' | 'desc'
}) {
  if (state === 'asc')
    return (
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.07848 6.16V12.25H8.07848V6.16L5.39848 8.85L4.68848 8.14L8.57848 4.25L12.4685 8.14L11.7585 8.85L9.07848 6.16Z"
          fill="#6B7280"
        />
      </svg>
    )
  if (state === 'desc')
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.50035 10.09V4H7.50035V10.09L4.82035 7.4L4.11035 8.11L8.00035 12L11.8904 8.11L11.1804 7.4L8.50035 10.09Z"
          fill="#6B7280"
        />
      </svg>
    )
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.9693 5.97L7.2693 6.68L5.9993 5.41V12H4.9993V5.41L3.7293 6.68L3.0293 5.97L5.4993 3.5L7.9693 5.97ZM12.9693 10.03L10.4993 12.5L8.0293 10.03L8.7293 9.32L9.9993 10.59V4H10.9993V10.59L12.2693 9.32L12.9693 10.03Z"
        fill="#6B7280"
      />
    </svg>
  )
}
