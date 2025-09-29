const TOKEN_KEY = 'access_token' // http.ts와 동일한 키 사용

export const tokenManager = {
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY)
  },

  hasToken: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}
