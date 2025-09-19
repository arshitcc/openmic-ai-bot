import type { NextRequest } from "next/server";
import crypto from "crypto";

export type ResponseData = {
  call_id: string;
  patient_found: boolean;
  patient_data?: {
    medical_id: string;
    name: string;
    last_visit: Date;
    allergies: string[];
    current_medications: string[];
    medical_conditions: string[];
  };
  message: string;
};

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function parseWebhookPayload(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-openmic-signature");

  if (!signature) {
    throw new Error("Missing webhook signature");
  }

  const webhookSecret = process.env.OPENMIC_WEBHOOK_SECRET;
  if (
    webhookSecret &&
    !verifyWebhookSignature(body, signature, webhookSecret)
  ) {
    throw new Error("Invalid webhook signature");
  }

  return JSON.parse(body);
}

export function createTunnelURL(endpoint: string): string {
  const tunnelURL = process.env.TUNNEL_URL;
  if (!tunnelURL) {
    throw new Error("TUNNEL_URL environment variable is required for webhooks");
  }
  return `${tunnelURL}${endpoint}`;
}

export function generateWebhookUrls() {
  return {
    preCall: createTunnelURL("/api/webhooks/pre-call"),
    functionCall: createTunnelURL("/api/webhooks/in-call"),
    postCall: createTunnelURL("/api/webhooks/post-call"),
  };
}
