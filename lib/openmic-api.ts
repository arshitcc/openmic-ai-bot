import axios, { type AxiosInstance } from "axios";
import type { OpenMicBot, OpenMicCall } from "./schemas";

class OpenMicAPI {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENMIC_API_KEY!;

    if (!this.apiKey) {
      throw new Error("OPENMIC_API_KEY environment variable is required");
    }

    this.client = axios.create({
      baseURL: "https://api.openmic.ai/v1",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async createBot(botData : any): Promise<OpenMicBot> {
    try {
      const response = await this.client.post("/bots", botData);
      return response.data;
    } catch (error) {
      console.error("Error creating bot:", error);
      throw new Error("Failed to create bot");
    }
  }

  async updateBot(
    botId: string,
    botData: any
  ): Promise<OpenMicBot> {
    try {
      const response = await this.client.patch(`/bots/${botId}`, botData);
      return response.data;
    } catch (error) {
      console.error("Error updating bot:", error);
      throw new Error("Failed to update bot");
    }
  }

  async deleteBot(botId: string): Promise<void> {
    try {
      await this.client.delete(`/bots/${botId}`);
    } catch (error) {
      console.error("Error deleting bot:", error);
      throw new Error("Failed to delete bot");
    }
  }

  async getBot(botId: string): Promise<OpenMicBot> {
    try {
      const response = await this.client.get(`/bots/${botId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bot:", error);
      throw new Error("Failed to fetch bot");
    }
  }

  async listBots(): Promise<OpenMicBot[]> {
    try {
      const response = await this.client.get("/bots");
      return response.data.bots || [];
    } catch (error) {
      console.error("Error listing bots:", error);
      throw new Error("Failed to list bots");
    }
  }

  // Call Management
  async initiateCall(data: any): Promise<OpenMicCall> {
    try {
      const response = await this.client.post("/create-phone-call", data);
      return response.data;
    } catch (error) {
      console.error("Error initiating call:", error);
      throw new Error("Failed to initiate call");
    }
  }

  async getCall(callId: string): Promise<OpenMicCall> {
    try {
      const response = await this.client.get(`/calls/${callId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching call:", error);
      throw new Error("Failed to fetch call");
    }
  }

  async listCalls(botId?: string): Promise<OpenMicCall[]> {
    try {
      const params = botId ? { bot_id: botId } : {};
      const response = await this.client.get("/calls", { params });
      return response.data.calls || [];
    } catch (error) {
      console.error("Error listing calls:", error);
      throw new Error("Failed to list calls");
    }
  }
}

// Singleton instance
export const openMicAPI = new OpenMicAPI();
export default openMicAPI;
