import { z } from "zod/v4";

export const BotFormSchema = z.object({
  name: z.string().min(1, "Bot name is required"),
  description: z.string().min(1, "Description is required"),
  prompt: z.string().min(50, "Prompt must be at least 50 characters"),
  domain: z.enum(["medical", "legal", "receptionist"]).default("medical"),
  settings: z.object({
    voice: z.string().default("alloy"),
    language: z.string().default("en"),
    maxCallDuration: z.number().min(60).max(1800).default(600),
  }),
});

export type BotFormData = z.infer<typeof BotFormSchema>;

export interface OpenMicBot {
  uid: string;
  name: string;
  prompt: string;
  first_message?: string;
  voice: string;
  language: string;
  webhook_url?: string;
  function_calling_webhook?: string;
  post_call_settings: {
    summary_prompt: string;
  };
  call_settings: {
    max_call_duration: number;
    silence_timeout_message: string;
    hipaa_compliance_enabled: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface OpenMicCall {
  call_id: string;
  agent_id: string;
  from_number: string;
  to_number : string
  customer_id: string; // medicalId
  status: string;
  transcript: [string, string][];
  start_timestamp : number;
  end_timestamp : number;
  duration_ms : number;
  call_analysis: any;
  created_at: string;
  ended_at?: string;
}

export interface PreCallWebhookPayload {
  call_id: string;
  bot_id: string;
  phone_number: string;
  timestamp: string;
}

export interface FunctionCallWebhookPayload {
  call_id: string;
  bot_id: string;
  function_name: string;
  parameters: Record<string, any>;
  timestamp: string;
}

export interface PostCallWebhookPayload {
  call_id: string;
  bot_id: string;
  phone_number: string;
  duration: number;
  transcript: string;
  summary: string;
  status: string;
  timestamp: string;
}
