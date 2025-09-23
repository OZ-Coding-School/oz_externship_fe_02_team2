export async function startMsw() {
  if (typeof window === 'undefined') return
  const { worker } = await import('./browser') // 기존 ./mocks/browser 등 경로
  await worker.start({
    serviceWorker: { url: '/mockServiceWorker.js' },
    onUnhandledRequest: 'bypass',
  })
  console.log('[MSW] started')
  return true
}