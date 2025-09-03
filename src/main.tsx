import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { ToastContainer } from './components/ui/Toast/ToastContainer.tsx'

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    {/* 전역 토스트 컨테이너 */}
    <ToastContainer />
  </BrowserRouter>
)
