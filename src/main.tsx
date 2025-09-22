import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from './components/ui/Toast/ToastContainer.tsx'

if (typeof window !== 'undefined' && import.meta.env.VITE_USE_MSW === 'true') {
  import('./mocks/startMsw.ts').then((m) => {
    void m.startMsw()
  })
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    {/* 전역 토스트 컨테이너 */}
    <ToastContainer />
  </BrowserRouter>
)
