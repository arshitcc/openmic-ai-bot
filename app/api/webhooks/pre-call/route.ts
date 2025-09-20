import { connectDB } from "@/lib/db";
import openMicAPI from "@/lib/openmic-api";
import { Bot } from "@/models/bot.model";
import { Call } from "@/models/call.model";
import { Patient } from "@/models/patient.model";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const payload = await request.json();

    const call = await Call.findOne({
      phoneNumber: payload.call.to_number,
      openMicBotId: payload.call.bot_id,
    });

    if (!call) {
      return NextResponse.json(
        { error: "No Query Call found for this contact provided" },
        { status: 404 }
      );
    }

    const patient = await Patient.findById(call?.patientId);

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const first_message = `Hello, may I speak with 
    {{patient.firstName}}? Hi, my name is Alex, and I'm an AI assistant calling from Dr. Smith's office to confirm your appointment for {{appointment.date}}.`;

    const post_call_settings = {
      structured_extraction_prompt: `
        return response  as { status: "CONFIRM" | "CANCEL" | "RESCHEDULE" } 
        if reschedule then give date and time in  {date, time}
        If the patient says CONFIRM for the appointment date return {status : "confirmed"}
        If the patient says CANCEL for the appointment date return {status : "cancelled"}
        If the patient says RESCHEDULE for the appointment date return {status : "rescheduled", date : date, time : time}
      `,
      success_evaluation_prompt: `If the patient says CONFIRM for the appointment date return {status : "confirmed"}
        If the patient says CANCEL for the appointment date return {status : "cancelled"}
        If the patient says RESCHEDULE for the appointment date return {status : "rescheduled", date : date, time : time}`,
      structured_extraction_json_schema: {
        status: "pending",
        date: new Date(),
        time: "",
      },
    };

    await openMicAPI.updateBot(call.openMicBotId, {
      prompt,
      first_message,
      post_call_settings,
    });

    await Bot.findOneAndUpdate(
      { openMicBotId: call.openMicBotId },
      { prompt, first_message, post_call_settings },
      { new: true }
    );

    return NextResponse.json({
      message: "Bot ready for call",
      patient,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          "Welcome to our medical practice. I'll help you with your intake today.",
      },
      { status: 500 }
    );
  }
}
