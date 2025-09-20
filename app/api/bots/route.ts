import { connectDB } from "@/lib/db";
import openMicAPI from "@/lib/openmic-api";
import { Bot } from "@/models/bot.model";
import {
  getPreAppointmentIntakeVerification,
  getPreAppointmentIntakeVerificationFirstMessage,
  medicalBotPrompt,
  medicalSummaryBotPrompt,
} from "@/utils/prompt";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const bots = await Bot.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ bots });
  } catch (error) {
    console.error("Error fetching bots:", error);
    return NextResponse.json(
      { error: "Failed to fetch bots" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    const openMicBot = await openMicAPI.createBot({
      name: data.name,
      prompt: medicalBotPrompt + getPreAppointmentIntakeVerification,
      voice: data.settings?.voice || "alloy",
      first_message: getPreAppointmentIntakeVerificationFirstMessage || "",
      call_settings: {
        max_call_duration: data.settings?.maxCallDuration || 5,
        silence_timeout_message:
          data.silence_timeout_message ||
          "You have been silent for too long. Please continue the conversation.",
        hipaa_compliance_enabled: true,
      },
      post_call_settings: {
        summary_prompt: data.summary_prompt || medicalSummaryBotPrompt,
        structured_extraction_prompt: `
        return response  as { status: "CONFIRM" | "CANCEL" | "RESCHEDULE" } 
        if reschedule then give date and time in  {date, time}
        If the patient says CONFIRM for the appointment date return {status : "confirmed"}
        If the patient says CANCEL for the appointment date return {status : "cancelled"}
        If the patient says RESCHEDULE for the appointment date return {status : "rescheduled", date : date, time : time}
      `,
        success_evaluation_prompt: `If the patient says CONFIRM for the appointment date return {status : "confirmed"}
        If the patient says CANCEL for the appointment date and ask for reason return {status : "cancelled", message:}
        If the patient says RESCHEDULE for the appointment date return {status : "rescheduled", date : date, time : time}`,
        structured_extraction_json_schema: {
          status: "confirm",
          date: new Date(),
          time: "",
          message : ""
        },
      },
    });

    const bot = await Bot.create({
      name: openMicBot.name,
      description: data.description,
      openMicBotId: openMicBot.uid,
      domain: data.domain || "medical",
      prompt: openMicBot.prompt || medicalBotPrompt,
      first_message: getPreAppointmentIntakeVerificationFirstMessage,
      settings: {
        voice: openMicBot.voice || "alloy",
        max_call_duration: openMicBot.call_settings.max_call_duration || 5,
        silence_timeout_message:
          openMicBot.call_settings.silence_timeout_message ||
          "You have been silent for too long. Please continue the conversation.",
        hipaa_compliance_enabled: true,
      },
      post_call_settings: {
        summary_prompt:
          openMicBot.post_call_settings.summary_prompt ||
          medicalSummaryBotPrompt,
      },
    });

    return NextResponse.json(
      { bot, message: "Bot created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bot:", error);
    return NextResponse.json(
      { error: "Failed to create bot" },
      { status: 500 }
    );
  }
}
