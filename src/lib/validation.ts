const PASSWORD_REGEX = /^(?=\S{6,15}$)(?=.*[a-z])(?=.*\d)(?=.*(?:[^\w\s]|_)).*$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string {
  if (!email) return ''
  return EMAIL_REGEX.test(email) ? '' : '이메일 형식이 올바르지 않습니다.'
}
/** 길이 6~15, 공백 금지, 영문 소문자/대문자/숫자 각 1+ */
export function validatePassword(pw: string): string {
  if (!pw) return ''
  if (!PASSWORD_REGEX.test(pw)) {
    return '비밀번호 형식이 올바르지 않습니다.'
  }
  return ''
}
