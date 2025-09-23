import type {
  RecruitmentDetail,
  RecruitmentStatus,
  Tag,
} from '@/pages/AdminRecruitments/AdminRecruitments.types'

const TAG_POOL: Tag[] = [
  { id: 'react', name: 'React' },
  { id: 'vue', name: 'Vue.js' },
  { id: 'angular', name: 'Angular' },
  { id: 'js', name: 'JavaScript' },
  { id: 'ts', name: 'TypeScript' },
  { id: 'spring', name: 'Spring Boot' },
  { id: 'node.js', name: 'Node.js' },
  { id: 'express', name: 'Express' },
  { id: 'nextjs', name: 'NextJS' },
  { id: 'java', name: 'Java' },
  { id: 'python', name: 'Python' },
  { id: 'django', name: 'Django' },
  { id: 'fast', name: 'FastAPI' },
  { id: 'flask', name: 'Flask' },
  { id: 'php', name: 'PHP' },
  { id: 'docker', name: 'Docker' },
  { id: 'kubernetes', name: 'Kubernetes' },
  { id: 'aws', name: 'AWS' },
  { id: 'azure', name: 'Azure' },
  { id: 'gcp', name: 'GCP' },
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'fullstack', name: 'Fullstack' },
  { id: 'devops', name: 'DevOps' },
  { id: 'ai', name: 'AI' },
  { id: 'ml', name: 'ML' },
]

const ri = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const pick = <T>(arr: T[]) => arr[ri(0, arr.length - 1)]
const pickMany = <T>(arr: T[], n: number) => {
  const c = [...arr]
  const o: T[] = []
  while (o.length < n && c.length) o.push(c.splice(ri(0, c.length - 1), 1)[0])
  return o
}
const ymd = (d: Date) => d.toISOString().slice(0, 10)
const ymdhm = (d: Date) => {
  const t = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()
  return t.slice(0, 16).replace('T', ' ')
}

export function generateRecruitmentSeeds(count = 100): RecruitmentDetail[] {
  const now = new Date()
  return Array.from({ length: count }, (_, i) => {
    const created = new Date(now.getTime() - ri(0, 35) * 86400000)
    const updated = new Date(created.getTime() + ri(0, 10) * 86400000)
    const status: RecruitmentStatus = Math.random() < 0.75 ? 'OPEN' : 'CLOSED'
    const deadline =
      Math.random() < 0.85
        ? ymd(new Date(now.getTime() + ri(1, 28) * 86400000))
        : null
    const tags = pickMany(TAG_POOL, ri(1, 3))
    const track = pick([
      'React',
      'Vue.js',
      'Spring Boot',
      'DevOps',
      'AI/ML',
      'Backend',
      'Frontend',
    ])
    const id = String(i + 1)
    const title = `${track} 스터디원 모집`

    const detail: RecruitmentDetail = {
      id,
      title,
      tags,
      deadline,
      status,
      views_count: ri(50, 2000),
      bookmarks_count: ri(0, 150),
      created_at: ymdhm(created),
      updated_at: ymdhm(updated),
    }
    return detail
  })
}

export const recruitmentSeeds: RecruitmentDetail[] =
  generateRecruitmentSeeds(100)
