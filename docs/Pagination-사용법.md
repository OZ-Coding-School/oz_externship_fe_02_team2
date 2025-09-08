# Pagination 컴포넌트 사용법

공용 페이지네이션 컴포넌트 (접근성 + 반응형)

제어형 컴포넌트: 내부 상태는 없습니다. currentPage/onChange 필수입니다.

</>: ±1 페이지로 이동합니다.

숫자 버튼: 화면 크기에 따라 5 또는 10개를 노출합니다(lg ≥ 1024px → 10, 그 외 5).

totalPages ≤ 1이면 렌더하지 않습니다.

작성자: 김민창

## 📌 개요

페이지네이션은 현재 페이지를 기준으로 숫자 버튼을 가변 노출(5/10개) 하고, 좌우 화살표로 ±1씩 이동합니다. 컴포넌트는 내부 상태가 없고, 상위에서 currentPage와 onChange로 제어합니다.

---

## 🛠 사용 방법

```tsx
import { useState } from 'react'
import Pagination from '@/components/Pagination'

export default function Demo() {
  const [page, setPage] = useState(1) // 아무 정수만 들어오면 됩니다.

  return <Pagination totalPages={42} currentPage={page} onChange={setPage} />
}
```

---

## 기초 예제

```tsx
// 서버 페이징(TanStack Query 연동 예시)
// limit은 데이터 레이어에서 담당하기에 의도적으로 제외하였습니다.

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Pagination from '@/components/Pagination'

async function fetchItems(page: number) {
  const res = await fetch(`/api/items?page=${page}`)
  return res.json() as Promise<{
    items: { id: string; title: string }[]
    totalPages: number
  }>
}

export default function ListPage() {
  const [page, setPage] = useState(1)
  const { data } = useQuery({
    queryKey: ['items', page],
    queryFn: () => fetchItems(page),
    keepPreviousData: true,
  })

  return (
    <>
      <ul>
        {data?.items?.map((it) => (
          <li key={it.id}>{it.title}</li>
        ))}
      </ul>

      <Pagination
        totalPages={data?.totalPages ?? 1}
        currentPage={page}
        onChange={setPage}
      />
    </>
  )
}
```

## 참고 사항

- 본 컴포넌트는 제어형을 전제로 합니다. onChange는 필수이며, 상위에서 currentPage를 실제로 갱신해야 UI가 바뀝니다.
  같은 페이지로 호출 시 이는 무시 됩니다. ( 중복 요청 방지 )
