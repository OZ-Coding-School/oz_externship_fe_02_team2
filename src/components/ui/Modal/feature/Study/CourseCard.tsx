import { ExternalLink } from 'lucide-react'
import type { Course } from './Study.types'

type CourseProps = {
  course: Course
}

export default function CourseCard({ course }: CourseProps) {
  return (
    <article
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
      aria-label={`강의: ${course.title}`}
    >
      <img
        src={course.thumbnailUrl ?? 'https://placehold.co/96x54?text=🎓'}
        alt=""
        className="h-14 w-22 rounded-md object-cover"
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <h5 className="truncate text-sm font-medium">{course.title}</h5>
        {course.teacher && (
          <div className="text-xs text-gray-500">강사: {course.teacher}</div>
        )}
        {course.externalUrl && (
          <a
            href={course.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 mt-1 inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            <ExternalLink className="size-3" aria-hidden="true" /> 강의 바로가기
          </a>
        )}
      </div>
    </article>
  )
}
