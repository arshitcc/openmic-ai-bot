import { connectDB } from "@/lib/db";
import openMicAPI from "@/lib/openmic-api";
import { Bot } from "@/models/bot.model";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: any) {
  try {
    await connectDB();
    const { id } = await context.params;
    const bot = await Bot.findById(id);

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    return NextResponse.json({ bot });
  } catch (error) {
    console.error("Error fetching bot:", error);
    return NextResponse.json({ error: "Failed to fetch bot" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: any) {
  try {
    await connectDB();
    const data = await request.json();
    const { id } = await context.params;

    const bot = await Bot.findById(id);
    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    await openMicAPI.updateBot(bot.openMicBotId, {
      name: data.name,
      prompt: data.prompt,
      voice: data.settings?.voice,
      language: data.settings?.language,
    });

    Object.assign(bot, data);
    await bot.save();

    return NextResponse.json({ bot });
  } catch (error) {
    console.error("Error updating bot:", error);
    return NextResponse.json(
      { error: "Failed to update bot" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: any) {
  try {
    await connectDB();

    const data = await request.json();
    const { id } = await context.params;
    const bot = await Bot.findById(id);
  } catch (error) {
    console.error("Error updating bot:", error);
    return NextResponse.json(
      { error: "Failed to update bot" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    await connectDB();
    const { id } = await context.params;
    const bot = await Bot.findById(id);

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    // Delete bot from OpenMic
    await openMicAPI.deleteBot(bot.openMicBotId);

    // Delete bot from database
    await Bot.findByIdAndDelete(id);

    return NextResponse.json({ message: "Bot deleted successfully" });
  } catch (error) {
    console.error("Error deleting bot:", error);
    return NextResponse.json(
      { error: "Failed to delete bot" },
      { status: 500 }
    );
  }
}
