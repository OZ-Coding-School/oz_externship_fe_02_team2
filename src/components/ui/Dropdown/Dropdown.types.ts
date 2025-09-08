export type Option = {
  /** 드롭다운에서 선택 가능한 항목 1개 */
  value: string
  /** 화면에 보이는 라벨 텍스트 */
  label: string
  /** 비활성화 여부: true면 클릭/선택/키보드 네비에서 건너뜀 */
  disabled?: boolean
}

export type DropdownProps = {
  /** 렌더링할 옵션 리스트 (readonly로 받아 내부에서 수정 금지) */
  options: readonly Option[]
  value?: string | null
  /**
   * value가 undefined일 때만 최초 선택값으로 사용됩니다.
   */
  defaultValue?: string | null
  /**
   * 선택 변경 콜백.
   * @param value  선택된 옵션의 value
   * @param option 선택된 옵션 객체 원본
   */
  onChange?: (value: string, option: Option) => void
  /** 값이 없을 때 버튼에 표시할 플레이스홀더 텍스트 */
  placeholder?: string
  /** 드롭다운 전체 비활성화 (버튼 클릭/키보드 입력 차단) */
  disabled?: boolean

  /**
   * 스타일 오버라이드용 클래스 슬롯.
   * 내부 기본 클래스와 병합(cn/tailwind-merge)되어 적용됩니다.
   */
  classes?: {
    /** 최상위 래퍼(div) – 위치/간격 등 컨테이너 스타일 */
    wrapper?: string
    /** 트리거 버튼 – 크기/색/정렬 등 버튼 스타일 */
    button?: string
    /** 메뉴 리스트(ul) – 폭/최대높이/스크롤 등 */
    menu?: string
    /** 옵션 항목(li) – 패딩/폰트/상태별 색 등 */
    option?: string
  }

  /**
   * 메뉴 정렬 방향.
   * 'start' → left-0, 'end' → right-0 로 정렬됩니다.
   */
  align?: 'start' | 'end'
}
