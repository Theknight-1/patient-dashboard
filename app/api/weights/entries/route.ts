// app/api/weight/entries/route.ts

import { NextResponse } from "next/server";
import { getWeightEntries, addWeightEntry } from "@/actions/weight-actions";

export async function GET() {
  try {
    const entries = await getWeightEntries();
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch weight entries" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const result = await addWeightEntry(formData);

    if ("error" in result) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add weight entry" },
      { status: 500 }
    );
  }
}
