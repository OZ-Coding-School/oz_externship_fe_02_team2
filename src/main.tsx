import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from './components/ui/Toast/ToastContainer'

const mount = () => {
  createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  )
}

const shouldUseMsw =
  typeof window !== 'undefined' && import.meta.env.VITE_USE_MSW === 'true'

// MSW를 켜야 한다면: 먼저 시작시키고, 끝난 뒤 렌더
if (shouldUseMsw) {
  import('src/mocks/startMsw') // 확장자 빼세요
    .then(({ startMsw }) => startMsw()) // 내부에서 await 처리
    .catch((e) => {
      console.warn('[MSW] failed to start:', e)
    })
    .finally(() => {
      mount()
    })
} else {
  // MSW를 쓰지 않는 빌드/환경이면 즉시 렌더
  mount()
}
