import { compare, hash } from "bcrypt"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { redirect } from "next/navigation"
import { db } from "./db"

// Secret key for JWT
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key_change_in_production")

// JWT token expiration (24 hours)
const tokenExpiration = "24h"

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

export async function comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  return compare(plainTextPassword, hashedPassword)
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(tokenExpiration)
    .sign(secretKey)
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secretKey)
    return verified.payload as { userId: string }
  } catch (error) {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  return user
}

export async function requireAuth() {
  const user = await getSession()
  if (!user) redirect("/login")
  return user
}
