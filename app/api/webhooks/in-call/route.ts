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
      { callId: payload.sessionId },
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
    const medicalId = payload.parameters.medical_id;

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
        patient_found: false,
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

    const patientInfo = {
      patient_found: true,
      patient_data: {
        medical_id: patient.medicalId,
        name: `${patient.firstName} ${patient.lastName}`,
        date_of_birth: patient.dateOfBirth.toISOString().split("T")[0],
        phone: patient.phone,
        email: patient.email,
        last_visit: patient.lastVisit
          ? patient.lastVisit.toISOString().split("T")[0]
          : null,
        allergies: patient.medicalHistory.allergies,
        current_medications: patient.medicalHistory.medications,
        medical_conditions: patient.medicalHistory.conditions,
        insurance_provider: patient.insurance.provider,
        emergency_contact: {
          name: patient.emergencyContact.name,
          relationship: patient.emergencyContact.relationship,
          phone: patient.emergencyContact.phone,
        },
      },
      message: `Thank you, ${
        patient.firstName
      }. I found your information. I can see you're with ${
        patient.insurance.provider
      } insurance and your last visit was ${
        patient.lastVisit
          ? new Date(patient.lastVisit).toLocaleDateString()
          : "not on record"
      }. How can I help you today?`,
    };

    return NextResponse.json(patientInfo);
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
