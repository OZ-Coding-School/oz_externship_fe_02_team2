import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from './components/ui/Toast/ToastContainer.tsx'

if (typeof window !== 'undefined' && import.meta.env.VITE_USE_MSW === 'true') {
  const { worker } = await import('./mocks/browser')
  await worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js',
      options: { scope: '/' }, // 앱이 서브패스면 거기에 맞춰 변경
    },
    onUnhandledRequest: 'bypass', // 모킹 안 한 건 실제로 보냄
    quiet: true,
  })
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    {/* 전역 토스트 컨테이너 */}
    <ToastContainer />
  </BrowserRouter>
)
