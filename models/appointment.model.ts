import mongoose, { type Document, Schema } from "mongoose";
import { IPatient } from "./patient.model";

export const AppointmentStatusEnum = {
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  FAILED: "failed",
  RESCHEDULED: "rescheduled",
  CANCELLED: "cancelled",
  PENDING: "pending",
  INITIATED: "initiated",
} as const;

export interface IAppointment extends Document {
  patientId: IPatient;
  medicalId: string;
  status: string;
  date: Date;
  time: string;
  note: string;
}

const appointmentSchema = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    medicalId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatusEnum),
      default: "pending",
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    note: String,
  },
  {
    timestamps: true,
  }
);

export const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
