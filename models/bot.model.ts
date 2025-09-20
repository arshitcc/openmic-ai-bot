import mongoose, { type Document, Schema } from "mongoose";

const AvailableDomainsEnum = {
  MEDICAL: "medical",
  LEGAL: "legal",
  RECEPTIONIST: "receptionist",
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
  first_message : string
  post_call_settings : object
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
    settings: {
      voice: {
        type: String,
        default: "alloy",
      },
      language: {
        type: String,
        default: "en",
      },
      maxCallDuration: {
        type: Number,
        default: 10 * 60,
      },
    },
    first_message : String,
    post_call_settings : Object
  },
  {
    timestamps: true,
  }
);

export const Bot =
  mongoose.models.Bot || mongoose.model<IBot>("Bot", BotSchema);
