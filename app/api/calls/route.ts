import { connectDB } from "@/lib/db";
import openMicAPI from "@/lib/openmic-api";
import { Appointment } from "@/models/appointment.model";
import { Bot } from "@/models/bot.model";
import { Call } from "@/models/call.model";
import { Patient } from "@/models/patient.model";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const botId = searchParams.get("botId");
    const status = searchParams.get("status");
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const page = Number.parseInt(searchParams.get("page") || "1");

    const query: any = {};
    if (botId) query.botId = botId;
    if (status) query.status = status;

    const calls = await Call.find(query)
      .populate("patientId", "firstName lastName medicalId")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Call.countDocuments(query);

    return NextResponse.json({
      calls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    const { customData, botId } = data;

    const patient = await Patient.findOne({ medicalId: customData.medicalId });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const appointment = await Appointment.findOne({
      patientId: patient._id.toString(),
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "No Query Call found for this contact provided" },
        { status: 404 }
      );
    }

    const bot = await Bot.findById(botId);

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    const call = await openMicAPI.initiateCall({
      from_number: process.env.OPENMIC_PHONE_NUMBER,
      to_number: patient.phone,
      override_agent_id: bot.openMicBotId,
      customer_id: patient.medicalId,
      dynamic_variables: {
        patient: {
          "medicalHistory.allergies":
            patient.medicalHistory.allergies.join(", "),
          "medicalHistory.medications":
            patient.medicalHistory.medications.join(", "),
          ...JSON.parse(JSON.stringify(patient)),
        },
        appointment: {
          ...JSON.parse(JSON.stringify(appointment)),
          date: new Date(appointment.date).toDateString(),
        },
      },
    });

    if (!call) {
      return NextResponse.json(
        { error: "Failed to initiate call" },
        { status: 500 }
      );
    }

    await Call.create({
      callId: call.call_id,
      botId: bot._id.toString(),
      openMicBotId: bot.openMicBotId,
      patientId: patient._id.toString(),
      medicalId: patient.medicalId,
      phoneNumber: patient.phone,
      dynamic_variables: {
        patient: {
          "medicalHistory.allergies":
            patient.medicalHistory.allergies.join(", "),
          "medicalHistory.medications":
            patient.medicalHistory.medications.join(", "),
          ...JSON.parse(JSON.stringify(patient)),
        },
        appointment: {
          ...JSON.parse(JSON.stringify(appointment)),
          date: new Date(appointment.date).toDateString(),
        },
      },
    });

    return NextResponse.json(
      { message: `Call Initiated for Patient : ${patient.name}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient" },
      { status: 500 }
    );
  }
}
