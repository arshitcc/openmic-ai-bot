import { connectDB } from "@/lib/db";
import { PreCallWebhookPayload } from "@/lib/schemas";
import { Call } from "@/models/call.model";
import { Patient } from "@/models/patient.model";
import { parseWebhookPayload, ResponseData } from "@/utils/webhook-utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload: PreCallWebhookPayload = await parseWebhookPayload(request);

    await connectDB();

    console.log("[Pre-call Webhook] Received payload:", payload);

    const call = await Call.create({
      callId: payload.call_id,
      botId: payload.bot_id,
      phoneNumber: payload.phone_number,
      status: "initiated",
      metadata: {
        startTime: new Date(payload.timestamp),
      },
      webhookData: {
        preCallData: payload,
      },
    });

    await call.save();

    const existingPatient = await Patient.findOne({
      phone: payload.phone_number,
    });

    let responseData: ResponseData = {
      call_id: payload.call_id,
      patient_found: false,
      message:
        "Welcome to our medical practice. I'll help you with your intake today.",
    };

    if (existingPatient) {
      call.patientId = existingPatient._id;
      await call.save();

      responseData = {
        call_id: payload.call_id,
        patient_found: true,
        patient_data: {
          medical_id: existingPatient.medicalId,
          name: `${existingPatient.firstName} ${existingPatient.lastName}`,
          last_visit: existingPatient.lastVisit,
          allergies: existingPatient.medicalHistory.allergies,
          current_medications: existingPatient.medicalHistory.medications,
          medical_conditions: existingPatient.medicalHistory.conditions,
        },
        message: `Hello ${existingPatient.firstName}! I have your information on file. Let me help you with your medical intake today.`,
      };

      console.log(
        "[Pre-call Webhook] Found existing patient:",
        existingPatient.medicalId
      );
    } else {
      console.log(
        "[Pre-call Webhook] No existing patient found for phone:",
        payload.phone_number
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[Pre-call Webhook] Error:", error);
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
