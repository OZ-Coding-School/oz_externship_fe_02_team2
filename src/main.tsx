import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from './components/ui/Toast/ToastContainer.tsx'

if (import.meta.env.VITE_USE_MSW === 'true' && typeof window !== 'undefined') {
  try {
    const { startMsw } = await import('./mocks/startMsw')
    await startMsw() // ⬅ 첫 요청 전에 완료 보장
  } catch (e) {
    console.warn('[MSW] failed to start:', e)
  }
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    {/* 전역 토스트 컨테이너 */}
    <ToastContainer />
  </BrowserRouter>
)
