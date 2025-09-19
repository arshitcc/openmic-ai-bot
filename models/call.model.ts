import mongoose, { type Document, Schema } from "mongoose";

export const CallStatusEnum = {
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  FAILED: "failed",
  RESCHEDULED: "rescheduled",
  CANCELLED: "cancelled",
  PENDING: "pending",
  INITIATED: "initiated",
} as const;

const UrgencyLevelEnum = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const AvailableCallStatus = Object.values(CallStatusEnum);
export const AvailableUrgencyLevels = Object.values(UrgencyLevelEnum);

export type CallStatus = (typeof AvailableCallStatus)[number];
export type UrgencyLevel = (typeof AvailableUrgencyLevels)[number];

export interface ICall extends Document {
  callId: string;
  botId: string;
  patientId?: string;
  phoneNumber: string;
  status: CallStatus;
  duration: number;
  transcript: string;
  summary: string;
  extractedData: {
    medicalId?: string;
    patientName?: string;
    reasonForCall?: string;
    urgencyLevel?: UrgencyLevel;
    followUpRequired?: boolean;
  };
  webhookData: {
    preCallData?: any;
    functionCallData?: any;
    postCallData?: any;
  };
  metadata: {
    startTime: Date;
    endTime?: Date;
    callQuality?: number;
    userSatisfaction?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CallSchema = new Schema<ICall>(
  {
    callId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    botId: {
      type: String,
      required: true,
      ref: "Bot",
    },
    patientId: {
      type: String,
      required: true,
      ref: "Patient",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: AvailableCallStatus,
      default: CallStatusEnum.INITIATED,
    },
    duration: {
      type: Number,
      default: 0,
    },
    transcript: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    extractedData: {
      medicalId: String,
      patientName: String,
      reasonForCall: String,
      urgencyLevel: {
        type: String,
        enum: AvailableUrgencyLevels,
      },
      followUpRequired: Boolean,
    },
    webhookData: {
      preCallData: Schema.Types.Mixed,
      functionCallData: Schema.Types.Mixed,
      postCallData: Schema.Types.Mixed,
    },
    metadata: {
      startTime: {
        type: Date,
        required: true,
      },
      endTime: Date,
      callQuality: Number,
      userSatisfaction: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Call =
  mongoose.models.Call || mongoose.model<ICall>("Call", CallSchema);
