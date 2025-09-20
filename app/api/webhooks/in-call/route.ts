import { connectDB } from "@/lib/db";
import { Call } from "@/models/call.model";
import { Patient } from "@/models/patient.model";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const payload = await request.json();
    console.log("[Function Call Webhook] Received payload:", payload);

    await Call.findOneAndUpdate(
      { callId: payload.call_id },
      { $set: { status: "in-progress" } }
    );

    return handleGetPatientInfo(payload);
  } catch (error) {
    console.error("[Function Call Webhook] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          "I apologize, but I'm having trouble accessing that information right now. I will connect you shortly.",
      },
      { status: 500 }
    );
  }
}

async function handleGetPatientInfo(payload: any) {
  try {
    const { medicalId } = payload.parameters;

    if (!medicalId) {
      return NextResponse.json(
        {
          error: "Medical ID is required",
          message:
            "I need your medical ID to look up your information. Could you please provide it?",
        },
        { status: 400 }
      );
    }

    console.log(
      "[Function Call] Looking up patient with medical ID:",
      medicalId
    );

    const patient = await Patient.findOne({ medicalId });

    if (!patient) {
      return NextResponse.json({
        verified: false,
        message: `I couldn't find a patient with medical ID ${medicalId}. Could you please verify the ID or provide your full name and date of birth?`,
      });
    }

    await Call.findOneAndUpdate(
      { callId: payload.call_id },
      {
        $set: {
          patientId: patient._id,
          "extractedData.medicalId": medicalId,
          "extractedData.patientName": `${patient.firstName} ${patient.lastName}`,
        },
      }
    );

    return NextResponse.json({
      verified: true,
      message: `Thank you ${patient.firstName} for confirmation`,
      details: `
         Patient Details:
        * Medical ID : ${patient.medicalId}
        * Name : ${patient.firstName} ${patient.lastName}
        * DOB : ${patient.dateOfBirth}
        * Address : ${patient.address.street}, ${patient.address.city}, ${patient.address.zipCode}
        * Phone : ${patient.phone}
        * Allergies : ${patient.medicalHistory.allergies} (list of strings)
        * Medications : ${patient.medicalHistory.medications} (list of strings)
        * Insurance : ${patient.insurance.provider} ${patient.insurance.policyNumber}
      `,
    });
  } catch (error) {
    console.error("[Function Call] Error in handleGetPatientInfo:", error);
    return NextResponse.json(
      {
        error: "Database error",
        message:
          "I'm having trouble accessing the patient database right now. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
