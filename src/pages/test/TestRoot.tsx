import { Button } from '@/components/ui/Button'
import { PATHS } from '@/routes/constants'
import { Outlet, useLocation, useNavigate } from 'react-router'

export default function TestRoot() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isRoot = pathname === '/'

  return (
    <div>
      <div className="min-h-dvh">
        {isRoot ? (
          <div className="grid min-h-dvh place-items-center p-6">
            <div className="-mt-20 w-full max-w-md space-y-4 text-center">
              <h1 className="mb-8">이동할 페이지를 선택해 주세요.</h1>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate(`/${PATHS.APP}`)}
                  btnText="웹 페이지로"
                  className="flex-1"
                />
                <Button
                  onClick={() => navigate(`/${PATHS.TEST}`)}
                  btnText="테스트 페이지로"
                  btnStyle="secondary"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  )
}
