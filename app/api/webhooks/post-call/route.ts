import { connectDB } from "@/lib/db";
import { PostCallWebhookPayload } from "@/lib/schemas";
import { Appointment } from "@/models/appointment.model";
import { Call, CallStatusEnum } from "@/models/call.model";
import { Patient } from "@/models/patient.model";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const payload = await request.json();

    console.log("[Post-call Webhook] Received payload:", payload);

    const call = await Call.findOneAndUpdate(
      { callId: payload.sessionId },
      {
        $set: {
          status:
            payload.status === CallStatusEnum.COMPLETED
              ? CallStatusEnum.COMPLETED
              : CallStatusEnum.FAILED,
          duration: payload.duration,
          transcript: payload.transcript,
          summary: payload.summary,
          "metadata.endTime": new Date(payload.timestamp),
          "webhookData.postCallData": payload,
        },
      },
      { new: true }
    );

    if (!call) {
      console.error("[Post-call Webhook] Call not found:", payload.sessionId);
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    const insights = await processCallInsights(payload, call);

    await Call.findByIdAndUpdate(call._id, {
      $set: {
        "extractedData.reasonForCall": insights.reasonForCall,
        "extractedData.urgencyLevel": insights.urgencyLevel,
        "extractedData.followUpRequired": insights.followUpRequired,
      },
    });

    if (call.patientId && insights.shouldUpdatePatient) {
      await updatePatientRecord(call.patientId, insights, payload);
    }

    console.log(
      "[Post-call Webhook] Call processed successfully:",
      payload.call_id
    );

    return NextResponse.json({
      success: true,
      call_id: payload.call_id,
      insights: insights,
      message: "Call processed successfully",
    });
  } catch (error) {
    console.error("[Post-call Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function processCallInsights(payload: PostCallWebhookPayload, call: any) {
  const transcript = payload.transcript.toLowerCase();
  const summary = payload.summary.toLowerCase();

  let reasonForCall = "General inquiry";
  if (transcript.includes("appointment") || summary.includes("appointment")) {
    reasonForCall = "Appointment scheduling";
  } else if (
    transcript.includes("prescription") ||
    transcript.includes("medication")
  ) {
    reasonForCall = "Prescription/Medication";
  } else if (transcript.includes("test result") || transcript.includes("lab")) {
    reasonForCall = "Test results";
  } else if (
    transcript.includes("emergency") ||
    transcript.includes("urgent")
  ) {
    reasonForCall = "Emergency/Urgent care";
  } else if (
    transcript.includes("insurance") ||
    transcript.includes("billing")
  ) {
    reasonForCall = "Insurance/Billing";
  }

  let urgencyLevel: "low" | "medium" | "high" = "low";
  if (
    transcript.includes("emergency") ||
    transcript.includes("urgent") ||
    transcript.includes("pain") ||
    transcript.includes("bleeding")
  ) {
    urgencyLevel = "high";
  } else if (
    transcript.includes("soon") ||
    transcript.includes("today") ||
    transcript.includes("asap")
  ) {
    urgencyLevel = "medium";
  }

  const followUpRequired =
    transcript.includes("follow up") ||
    transcript.includes("callback") ||
    transcript.includes("appointment") ||
    urgencyLevel === "high";

  const shouldUpdatePatient =
    call.patientId &&
    (transcript.includes("new medication") ||
      transcript.includes("allergy") ||
      transcript.includes("address change") ||
      transcript.includes("phone change"));

  return {
    reasonForCall,
    urgencyLevel,
    followUpRequired,
    shouldUpdatePatient,
    callQuality: payload.duration > 60 ? "good" : "short",
    extractedKeywords: extractKeywords(transcript),
  };
}

async function updatePatientRecord(
  patientId: string,
  insights: any,
  payload: PostCallWebhookPayload
) {
  try {
    const updateData: any = {
      lastVisit: new Date(),
      $push: {
        notes: `Call on ${new Date().toLocaleDateString()}: ${payload.summary}`,
      },
    };

    const transcript = payload.transcript.toLowerCase();

    if (transcript.includes("new allergy")) {
      const allergyMatch = transcript.match(/allergic to (\w+)/i);
      if (allergyMatch) {
        updateData.$addToSet = {
          "medicalHistory.allergies": allergyMatch[1],
        };
      }
    }

    await Patient.findByIdAndUpdate(patientId, updateData);
    await Appointment.findOneAndUpdate(
      { patientId },
      { status: payload.status }
    );
    console.log("[Post-call] Updated patient record:", patientId);
  } catch (error) {
    console.error("[Post-call] Error updating patient record:", error);
  }
}

function extractKeywords(transcript: string): string[] {
  const medicalKeywords = [
    "pain",
    "medication",
    "prescription",
    "allergy",
    "symptoms",
    "appointment",
    "emergency",
    "urgent",
    "test",
    "results",
    "insurance",
    "billing",
    "doctor",
    "nurse",
    "surgery",
  ];

  return medicalKeywords.filter((keyword) =>
    transcript.toLowerCase().includes(keyword)
  );
}
