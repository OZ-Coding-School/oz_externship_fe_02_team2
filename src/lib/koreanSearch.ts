// 초성 매칭 유틸 (완성형 한글 → 초성열 변환, 질의 판별)
export const PRONUNCIATION_LIST = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
]
const HANGUL_BASE = 0xac00 // '가'
const HANGUL_END = 0xd7a3 // '힣'

export const isHangulSyllable = (ch: string) => {
  const c = ch.charCodeAt(0)
  return c >= HANGUL_BASE && c <= HANGUL_END
}

export const toPronunciation = (text: unknown) => {
  const s = String(text ?? '')
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (isHangulSyllable(ch)) {
      const code = ch.charCodeAt(0) - HANGUL_BASE
      const choIndex = Math.floor(code / (21 * 28))
      out += PRONUNCIATION_LIST[choIndex] ?? ch
    } else {
      out += ch
    }
  }
  return out
}

// 초성만으로 이루어진 질의인지 (호환 자모 및 현대 초성)
export const isPronunciationQuery = (q: string) =>
  /^[\u3131-\u314E\u1100-\u1112]+$/.test(q)
