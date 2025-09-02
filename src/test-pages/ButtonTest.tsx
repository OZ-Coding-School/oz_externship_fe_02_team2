import { useState } from 'react'
import Button from '@components/common/Button/Button'
import DownloadIcon from '@assets/icons/download_w.svg'
import ShareIcon from '@assets/icons/share_g.svg'
import SettingIcon from '@assets/icons/setting_g.svg'
import BinIcon from '@assets/icons/bin_r.svg'

export default function ButtonTest() {
  const [count, setCount] = useState(0)

  const handleClick = () => setCount((c) => c + 1)

  return (
    <section className="h-screen space-y-4 bg-white p-6">
      <h3>Button 컴포넌트 테스트</h3>
      <p className="body-sm">버튼을 눌러 카운트를 확인하세요.</p>

      <article className="mb-6 flex flex-col gap-1">
        <h4>스타일별 버튼</h4>
        <div className="flex gap-3">
          <Button
            btnStyle="primary"
            btnSize="medium"
            btnText={`클릭 횟수: ${count}`}
            onClick={handleClick}
          />
          <Button
            btnStyle="secondary"
            btnSize="medium"
            btnText={`클릭 횟수: ${count}`}
            onClick={handleClick}
          />
          <Button
            btnStyle="success"
            btnSize="medium"
            btnText={`클릭 횟수: ${count}`}
            onClick={handleClick}
          />
          <Button
            btnStyle="danger"
            btnSize="medium"
            btnText={`클릭 횟수: ${count}`}
            onClick={handleClick}
          />
          <Button
            btnStyle="warning"
            btnSize="medium"
            btnText={`클릭 횟수: ${count}`}
            onClick={handleClick}
          />
          <Button
            btnStyle="cancel"
            btnSize="medium"
            btnText={`클릭 횟수: ${count}`}
            onClick={handleClick}
          />
        </div>
      </article>

      <article className="mb-6 flex flex-col gap-1">
        <h4>사이즈별 버튼</h4>
        <div className="flex items-end gap-3">
          <Button
            btnStyle="primary"
            btnSize="small"
            btnText={`클릭 횟수: ${count}`}
            onClick={handleClick}
          />
          <Button
            btnStyle="primary"
            btnSize="medium"
            btnText={`클릭 횟수: ${count}`}
            onClick={handleClick}
          />
          <Button
            btnStyle="primary"
            btnSize="large"
            btnText={`클릭 횟수: ${count}`}
            onClick={handleClick}
          />
        </div>
      </article>

      <article className="mb-6 flex flex-col gap-1">
        <h4>아이콘 버튼</h4>
        <div className="flex gap-3">
          <Button
            btnStyle="primary"
            btnSize="medium"
            btnIcon={<img src={DownloadIcon} alt="다운로드 아이콘" />}
            btnText="다운로드"
          />
          <Button
            btnStyle="secondary"
            btnSize="medium"
            btnIcon={<img src={ShareIcon} alt="공유 아이콘" />}
            btnText="공유"
          />
          <Button
            btnStyle="secondary"
            btnSize="medium"
            btnIcon={<img src={SettingIcon} alt="설정 아이콘" />}
            iconOnly
          />
          <Button
            btnStyle="danger"
            btnSize="medium"
            btnIcon={<img src={BinIcon} alt="삭제 아이콘" />}
            iconOnly
          />
        </div>
      </article>

      <article className="mb-6 flex flex-col gap-1">
        <h4>비활성 버튼</h4>
        <div className="flex items-end gap-3">
          <Button
            btnStyle="primary"
            btnSize="large"
            btnText={`클릭 횟수: ${count}`}
            onClick={handleClick}
            disabled
          />
          <Button
            btnStyle="secondary"
            btnSize="medium"
            btnIcon={<img src={ShareIcon} alt="공유 아이콘" />}
            btnText="공유"
            disabled
          />
          <Button
            btnStyle="danger"
            btnSize="medium"
            btnIcon={<img src={BinIcon} alt="삭제 아이콘" />}
            iconOnly
            disabled
          />
        </div>
      </article>
    </section>
  )
}
