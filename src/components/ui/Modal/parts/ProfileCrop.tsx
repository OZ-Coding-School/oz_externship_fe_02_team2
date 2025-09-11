import { useEffect, useId, useRef, useState } from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import Modal from '../Modal'
import { Button } from '../../Button'
import { Input } from '../../input/Input'

type ProfileProps = {
  open: boolean
  initialSrc?: string // 기존 아바타 URL (없어도 됨)
  onClose: () => void
  onConfirm: (r: { blob: Blob; previewURL: string }) => void
  aspect?: number // 기본 1 (정사각형)
  size?: number // 내보낼 이미지 한 변(px), 기본 300
}

export default function ProfileCrop({
  open,
  initialSrc,
  onClose,
  onConfirm,
  aspect = 1,
  size = 300,
}: ProfileProps) {
  const fileInputId = useId()
  const imgRef = useRef<HTMLImageElement | null>(null) // ← 크롭 이미지 ref
  const fileRef = useRef<HTMLInputElement | null>(null) // ← 파일 인풋 ref (새로 추가)
  const lastObjUrlRef = useRef<string | null>(null)

  const [imgSrc, setImgSrc] = useState<string>(initialSrc ?? '')
  const [scale, setScale] = useState(1.2)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [exportMime, setExportMime] = useState<
    'image/png' | 'image/jpeg' | 'image/webp'
  >('image/png')

  // blob: URL 정리
  const revokeObjUrl = () => {
    const u = lastObjUrlRef.current
    if (u && u.startsWith('blob:')) URL.revokeObjectURL(u)
    lastObjUrlRef.current = null
  }

  useEffect(() => {
    if (open) {
      revokeObjUrl()
      setImgSrc(initialSrc ?? '')
      setScale(1.2)
      setCrop(undefined)
      setCompletedCrop(undefined)
      setExportMime('image/png') // 투명 배경 기본
    }
    return () => revokeObjUrl()
  }, [open, initialSrc])

  // 초기 크롭을 가운데/aspect 맞춤으로 생성
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget
    const initial = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, aspect, w, h),
      w,
      h
    )
    setCrop(initial)
  }

  // 파일 선택
  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    revokeObjUrl()
    const url = URL.createObjectURL(f)
    lastObjUrlRef.current = url
    setImgSrc(url)
    setScale(1.2)

    if (f.type === 'image/jpeg' || f.type === 'image/jpg')
      setExportMime('image/jpeg')
    else if (f.type === 'image/webp') setExportMime('image/webp')
    else setExportMime('image/png')

    // 같은 파일 재선택 허용
    e.currentTarget.value = ''
  }

  // Crop된 영역을 캔버스에 그려 Blob 반환
  const renderToBlob = async (): Promise<Blob | null> => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) {
      return null
    }
    const image = imgRef.current
    const canvas = document.createElement('canvas')

    // 내보낼 목표 크기
    const outW = size
    const outH = Math.round(size / aspect) // aspect=1이면 size

    canvas.width = outW
    canvas.height = outH

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // 원형 마스크: PNG/WebP에서는 투명 배경 유지
    if (exportMime !== 'image/jpeg') {
      ctx.save()
      ctx.beginPath()
      const r = Math.min(outW, outH) / 2
      ctx.arc(outW / 2, outH / 2, r, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.clip()
    }

    // 소스 이미지에서 실제 크롭 좌표 계산 (react-image-crop은 픽셀 단위 제공)
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const srcX = completedCrop.x * scaleX
    const srcY = completedCrop.y * scaleY
    const srcW = completedCrop.width * scaleX
    const srcH = completedCrop.height * scaleY

    // scale(줌) 적용: 표시 시 이미지에 transform을 줬으므로,
    // 내보낼 때는 크롭 박스를 확대해서 대응
    const zoom = scale
    const dstW = outW
    const dstH = outH

    // zoom을 반영하기 위해 원본에서 더 작은 영역을 잘라낸다(=확대 효과)
    const zoomedSrcW = srcW / zoom
    const zoomedSrcH = srcH / zoom
    const zoomedSrcX = srcX + (srcW - zoomedSrcW) / 2
    const zoomedSrcY = srcY + (srcH - zoomedSrcH) / 2

    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(
      image,
      zoomedSrcX,
      zoomedSrcY,
      zoomedSrcW,
      zoomedSrcH,
      0,
      0,
      dstW,
      dstH
    )

    if (exportMime !== 'image/jpeg') {
      ctx.restore()
      // 배경 투명 유지
    } else {
      // JPEG은 투명 없음 → 배경 흰색으로 깔고 싶다면 위 draw 이전에 fillRect로 채우기
      // ctx.globalCompositeOperation = 'destination-over'
      // ctx.fillStyle = '#fff'
      // ctx.fillRect(0, 0, dstW, dstH)
    }

    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob(
        (b) => res(b),
        exportMime,
        exportMime === 'image/jpeg' ? 0.9 : undefined
      )
    )
    return blob
  }

  const handleConfirm = async () => {
    const blob = await renderToBlob()
    if (!blob) return
    const previewURL = URL.createObjectURL(blob)
    onConfirm({ blob, previewURL })
  }

  return (
    <Modal open={open} onClose={onClose} size="default">
      <Modal.Header>
        <Modal.Title>프로필 이미지 편집</Modal.Title>
      </Modal.Header>

      <div className="border-b border-gray-200" />

      <Modal.Body>
        {!imgSrc ? (
          <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50">
            <p className="text-sm text-gray-500">
              이미지를 업로드해서 아바타를 편집하세요
            </p>

            {/* 접근 가능한 파일 인풋 */}
            <Input
              id={fileInputId}
              ref={imgRef as unknown as React.RefObject<HTMLInputElement>} // 타입안전 위해 아래 실제 input 따로 둠
              className="hidden"
              aria-hidden
              tabIndex={-1}
              readOnly
            />
            <input
              id={`${fileInputId}-file`}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFileSelected}
              aria-label="프로필 이미지 선택"
            />
            <label htmlFor={`${fileInputId}-file`} className="inline-block">
              <Button
                btnStyle="primary"
                btnText="이미지 선택"
                onClick={() => {
                  if (!fileRef.current) return
                  fileRef.current.value = '' // 같은 파일을 다시 골라도 onChange 발생
                  fileRef.current.click() // ← 파일 다이얼로그 열기
                }}
              />
            </label>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="overflow-hidden rounded-full ring-1 ring-gray-200">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                circularCrop
                aspect={aspect}
                minWidth={50}
                keepSelection
                ruleOfThirds={false}
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className={`transform scale-[${scale}]`}
                  alt="미리보기"
                />
              </ReactCrop>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={4}
                step={0.01}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                aria-label="확대/축소"
              />
              <span className="text-sm text-gray-500">
                줌: {scale.toFixed(2)}x
              </span>

              {/* 다른 이미지 선택 */}
              <input
                id={`${fileInputId}-file2`}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onFileSelected}
                aria-label="다른 프로필 이미지 선택"
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onFileSelected}
                aria-label="프로필 이미지 선택"
              />

              <label htmlFor={`${fileInputId}-file2`} className="inline-block">
                <Button
                  btnStyle="secondary"
                  btnText="다른 이미지"
                  onClick={() => {
                    if (!fileRef.current) return
                    fileRef.current.value = ''
                    fileRef.current.click()
                  }}
                />
              </label>
            </div>
          </div>
        )}
      </Modal.Body>

      <div className="border-b border-gray-200" />
      <Modal.Footer className="bg-gray-50 py-5">
        <div className="flex w-full justify-end gap-8">
          <Button btnStyle="secondary" btnText="취소" onClick={onClose} />
          <Button
            btnStyle="primary"
            btnText="적용"
            onClick={handleConfirm}
            disabled={!completedCrop}
          />
        </div>
      </Modal.Footer>
    </Modal>
  )
}
