"use server"

import { db } from "@/lib/db"
import { getSession, requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const weightEntrySchema = z.object({
  weight: z.coerce.number().positive(),
  notes: z.string().optional(),
})

export async function addWeightEntry(formData: FormData) {
  const user = await requireAuth()

  const weight = formData.get("weight") as string
  const notes = formData.get("notes") as string

  try {
    const result = weightEntrySchema.parse({ weight, notes })

    await db.weightEntry.create({
      data: {
        userId: user.id,
        weight: result.weight,
        notes: result.notes,
      },
    })

    revalidatePath("/dashboard/weight")
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Please enter a valid weight" }
    }
    return { error: "Something went wrong. Please try again." }
  }
}

export async function getWeightEntries() {
  const user = await getSession()
  if (!user) return []

  const entries = await db.weightEntry.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
  })

  return entries
}

export async function getUserProfile() {
  const user = await getSession()
  if (!user) return null

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  })

  return profile
}

export async function updateProfile(formData: FormData) {
  const user = await requireAuth()

  const targetWeight = formData.get("targetWeight") as string
  const height = formData.get("height") as string
  const currentMedication = formData.get("currentMedication") as string
  const dosage = formData.get("dosage") as string

  try {
    await db.profile.update({
      where: { userId: user.id },
      data: {
        targetWeight: targetWeight ? Number.parseFloat(targetWeight) : undefined,
        height: height ? Number.parseFloat(height) : undefined,
        currentMedication,
        dosage,
      },
    })

    revalidatePath("/dashboard/profile")
    return { success: true }
  } catch (error) {
    return { error: "Something went wrong. Please try again." }
  }
}
