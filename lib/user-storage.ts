// Shared user storage for authentication
// This ensures both signup and login routes access the same data

import crypto from "crypto"

export interface User {
  email: string
  password: string
  verified: boolean
  verificationToken: string
  createdAt: Date
}

// In-memory user storage (shared across all API routes)
const users = new Map<string, User>()

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function createUser(email: string, password: string): User {
  const hashedPassword = hashPassword(password)
  const verificationToken = crypto.randomBytes(32).toString("hex")

  const user: User = {
    email,
    password: hashedPassword,
    verified: false,
    verificationToken,
    createdAt: new Date(),
  }

  users.set(email, user)
  console.log("[v0] User created:", email, "Total users:", users.size)
  return user
}

export function getUser(email: string): User | undefined {
  return users.get(email)
}

export function verifyUser(token: string): boolean {
  for (const [email, user] of users.entries()) {
    if (user.verificationToken === token) {
      user.verified = true
      users.set(email, user)
      console.log("[v0] User verified:", email)
      return true
    }
  }
  return false
}

export function getAllUsers(): User[] {
  return Array.from(users.values())
}

export function getUserCount(): number {
  return users.size
}
