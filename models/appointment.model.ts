import mongoose, { type Document, Schema } from "mongoose";

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

const appointmentSchema = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
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
  },
  {
    timestamps: true,
  }
);

export const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
