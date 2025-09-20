import { connectDB } from "@/lib/db";
import { Call } from "@/models/call.model";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { callId: string } }
) {
  try {
    await connectDB();

    const call = await Call.findOne({ callId: params.callId }).populate(
      "patientId",
      "firstName lastName medicalId email phone"
    );

    if (!call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    return NextResponse.json({ call });
  } catch (error) {
    console.error("Error fetching call:", error);
    return NextResponse.json(
      { error: "Failed to fetch call" },
      { status: 500 }
    );
  }
}
