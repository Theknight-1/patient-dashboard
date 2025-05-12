// app/api/shipments/route.ts

import { NextResponse } from "next/server";
import { getShipments } from "@/actions/shipment-actions"; // adjust path if needed

export async function GET() {
  try {
    const shipments = await getShipments();
    return NextResponse.json(shipments);
  } catch (error) {
    console.error("Failed to fetch shipments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
