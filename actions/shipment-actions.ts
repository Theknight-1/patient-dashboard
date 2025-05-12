"use server"

import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function getShipments() {
  const user = await getSession()
  if (!user) return []

  const shipments = await db.shipment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return shipments
}

// For demo purposes, let's add some mock shipments
export async function addMockShipments() {
  const user = await getSession()
  if (!user) return { error: "Not authenticated" }

  // Check if user already has shipments
  const existingShipments = await db.shipment.count({
    where: { userId: user.id },
  })

  if (existingShipments > 0) {
    return { message: "Mock shipments already added" }
  }

  const today = new Date()
  const oneWeekAgo = new Date(today)
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const twoWeeksAgo = new Date(today)
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  const oneWeekFromNow = new Date(today)
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)

  await db.shipment.createMany({
    data: [
      {
        userId: user.id,
        medicationType: "Semaglutide",
        dosage: "0.25mg",
        status: "delivered",
        trackingNumber: "TRK123456789",
        shippedDate: twoWeeksAgo,
        estimatedDelivery: oneWeekAgo,
        actualDelivery: oneWeekAgo,
      },
      {
        userId: user.id,
        medicationType: "Semaglutide",
        dosage: "0.5mg",
        status: "shipped",
        trackingNumber: "TRK987654321",
        shippedDate: today,
        estimatedDelivery: oneWeekFromNow,
        actualDelivery: null,
      },
      {
        userId: user.id,
        medicationType: "Semaglutide",
        dosage: "1.0mg",
        status: "processing",
        trackingNumber: null,
        shippedDate: null,
        estimatedDelivery: null,
        actualDelivery: null,
      },
    ],
  })

  return { success: true }
}
