/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * test-pages/*Test.tsx 파일을 자동 스캔합니다.
 */
type Loader = () => Promise<{ default: React.ComponentType<any> }>

export type TestPageEntry = {
  key: string
  name: string
  route: string
  loader: Loader
}

const modules = import.meta.glob('../test-pages/**/*Test.tsx') as Record<
  string,
  Loader
>

function fileNameFromPath(p: string) {
  const last = p.split('/').pop() ?? ''
  return last.replace(/\.(t|j)sx?$/, '')
}

function stripTestSuffix(name: string) {
  return name.replace(/Test$/i, '')
}

function toKebabCase(s: string) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

function toDisplayName(s: string) {
  return stripTestSuffix(s).replace(/([a-z0-9])([A-Z])/g, '$1 $2')
}

export const testPages: TestPageEntry[] = Object.entries(modules)
  .map(([key, loader]) => {
    const base = stripTestSuffix(fileNameFromPath(key))
    const name = toDisplayName(base)
    const route = `/test-pages/${toKebabCase(base)}`
    return { key, name, route, loader }
  })
  .sort((a, b) => a.name.localeCompare(b.name))
