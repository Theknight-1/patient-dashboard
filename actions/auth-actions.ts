"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { comparePasswords, createToken, hashPassword } from "@/lib/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const result = loginSchema.parse({ email, password })

    const user = await db.user.findUnique({
      where: { email: result.email },
    })

    if (!user) {
      return { error: "Invalid email or password" }
    }

    const passwordMatch = await comparePasswords(result.password, user.password)

    if (!passwordMatch) {
      return { error: "Invalid email or password" }
    }

    const token = await createToken(user.id)

    ;(await cookies()).set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    })

    redirect("/dashboard")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Invalid email or password format" }
    }
    return { error: "Something went wrong. Please try again." }
  }
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const result = registerSchema.parse({ name, email, password })

    const existingUser = await db.user.findUnique({
      where: { email: result.email },
    })

    if (existingUser) {
      return { error: "Email already in use" }
    }

    const hashedPassword = await hashPassword(result.password)

    const user = await db.user.create({
      data: {
        name: result.name,
        email: result.email,
        password: hashedPassword,
        profile: {
          create: {
            startingWeight: 0,
            targetWeight: 0,
            height: 0,
          },
        },
      },
    })

    const token = await createToken(user.id)

    ;(await cookies()).set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    })

    redirect("/dashboard")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Please check your information and try again" }
    }
    return { error: "Something went wrong. Please try again." }
  }
}

export async function logout() {
  (await cookies()).delete("token")
  redirect("/login")
}
