import mongoose, { type Document, Schema } from "mongoose";

export const AvailableDomainsEnum = {
  MEDICAL: "medical",
} as const;

export const AvailableDomains = Object.values(AvailableDomainsEnum);
export type Domains = (typeof AvailableDomains)[number];

export interface IBot extends Document {
  name: string;
  description: string;
  openMicBotId: string;
  domain: Domains;
  prompt: string;
  isActive: boolean;
  webhookUrls: {
    preCall: string;
    functionCall: string;
    postCall: string;
  };
  settings: {
    voice: string;
    language: string;
    maxCallDuration: number;
  };
  first_message: string;
  post_call_settings: object;
  createdAt: Date;
  updatedAt: Date;
}

const BotSchema = new Schema<IBot>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    openMicBotId: {
      type: String,
      required: true,
      unique: true,
    },
    domain: {
      type: String,
      enum: AvailableDomains,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    webhookUrls: {
      preCall: String,
      functionCall: String,
      postCall: String,
    },
    settings: Object,
    first_message: String,
    post_call_settings: Object,
  },
  {
    timestamps: true,
  }
);

export const Bot =
  mongoose.models.Bot || mongoose.model<IBot>("Bot", BotSchema);
