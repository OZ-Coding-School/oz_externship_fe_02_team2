# 📘 Skeleton 컴포넌트 사용법

## 📌 개요

`Skeleton` 컴포넌트는 데이터 로딩 상태에서 실제 콘텐츠 대신 **뼈대 UI**를 보여주는 프레젠테이션 컴포넌트.  
사용자는 로딩 중임을 직관적으로 인지할 수 있고, 레이아웃 점프 없이 부드럽게 실제 UI로 전환됨.

---

## 📦 설치 / 위치

- 파일 위치: `src/components/ui/Skeleton.tsx`
- 별도의 의존성 없음 (Tailwind CSS 기반)

---

## 🛠 사용 방법

### 1. 기본 사용

```tsx
import Skeleton from '@/components/ui/Skeleton'

export default function ProfilePage() {
  const { data, isLoading } = useUserDetail()

  return (
    <section aria-busy={isLoading ? 'true' : 'false'}>
      {isLoading ? <Skeleton /> : <ProfileDetail data={data} />}
    </section>
  )
}
```
