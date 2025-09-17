const PASSWORD_REGIX =
  /^(?=\S{6,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(?:[^\w\s]|_)).*$/
const EMAIL_REGIX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string {
  if (!email) return ''
  return EMAIL_REGIX.test(email) ? '' : '이메일 형식이 올바르지 않습니다.'
}
/** 길이 6~15, 공백 금지, 소문자/대문자/숫자 각 1+ */
export function validatePassword(pw: string): string {
  if (!pw) return ''
  if (!PASSWORD_REGIX.test(pw)) {
    return '6~15자, 영문 대소문자/숫자/특수문자를 모두 포함해야 합니다. (공백 불가)'
  }
  return ''
}
