// Simple client-side authentication utilities

export interface User {
  email: string
  loginTime: string
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function login(email: string): boolean {
  if (!isValidEmail(email)) {
    return false
  }

  const user: User = {
    email,
    loginTime: new Date().toISOString(),
  }

  localStorage.setItem("user", JSON.stringify(user))
  return true
}

export function logout(): void {
  localStorage.removeItem("user")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
