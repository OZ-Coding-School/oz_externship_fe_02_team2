const MODAL_ROOT_ID = '__modal_portal__'

export function ensurePortalRoot() {
  let root = document.getElementById(MODAL_ROOT_ID)
  if (!root) {
    root = document.createElement('div')
    root.id = MODAL_ROOT_ID
    document.body.appendChild(root)
  }
  return root
}
