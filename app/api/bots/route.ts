import { connectDB } from "@/lib/db";
import openMicAPI from "@/lib/openmic-api";
import { Bot } from "@/models/bot.model";
import { getPreAppointmentIntakeVerification, medicalBotPrompt, medicalSummaryBotPrompt } from "@/utils/prompt";
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
      language: data.settings?.language || "en",
      first_message: data.first_message || "",
      call_settings: {
        max_call_duration: data.settings?.maxCallDuration || 5,
        silence_timeout_message:
          data.silence_timeout_message ||
          "You have been silent for too long. Please continue the conversation.",
        hipaa_compliance_enabled: true,
      },
      post_call_settings: {
        summary_prompt: data.summary_prompt || medicalSummaryBotPrompt,
      },
    });

    const bot = await Bot.create({
      name: data.name,
      description: data.description,
      openMicBotId: openMicBot.uid,
      domain: data.domain || "medical",
      prompt: data.prompt || medicalBotPrompt,
      first_message: data.first_message || "",
      settings: {
        voice: data.settings?.voice || "alloy",
        language: data.settings?.language || "en",
        maxCallDuration: data.settings?.maxCallDuration || 600,
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
