// app/api/weight/profile/route.ts

import { NextResponse } from "next/server";
import { getUserProfile, updateProfile } from "@/actions/weight-actions";

export async function GET() {
  try {
    const profile = await getUserProfile();
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const result = await updateProfile(formData);

    if ("error" in result) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
