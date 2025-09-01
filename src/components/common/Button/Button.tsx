export default function Button() {
  return (
    <button
      type="button"
      onClick={() => console.log('button clicked!')}
      className=""
    >
      {btnIcon && <span>{btnIcon}</span>}
      {btnText}
    </button>
  )
}
