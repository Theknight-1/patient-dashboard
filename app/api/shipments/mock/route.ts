// app/api/shipments/mock/route.ts

import { NextResponse } from "next/server";
import { addMockShipments } from "@/actions/shipment-actions";

export async function POST() {
  try {
    const result = await addMockShipments();

    if ("error" in result) {
      return NextResponse.json(result, { status: 401 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to add mock shipments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
