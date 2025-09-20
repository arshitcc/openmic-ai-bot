import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { OpenMicCall } from "./schemas";
import { IPatient } from "@/models/patient.model";

class ApiClient {
  private client: AxiosInstance;

  constructor(baseUrl = "/api") {
    this.client = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message =
          error.response?.data?.error || error.message || "An error occurred";
        throw new Error(message);
      }
    );
  }

  private async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const response = await this.client.request<T>({
      url: endpoint,
      ...config,
    });
    return response.data;
  }

  async getBots() {
    return this.request<{ bots: any[] }>("/bots");
  }

  async createBot(data: any) {
    return this.request<{ bot: any }>("/bots", {
      method: "POST",
      data,
    });
  }

  async updateBot(id: string, data: any) {
    return this.request<{ bot: any }>(`/bots/${id}`, {
      method: "PUT",
      data,
    });
  }

  async deleteBot(id: string) {
    return this.request(`/bots/${id}`, {
      method: "DELETE",
    });
  }

  async getCalls(params?: {
    patientId?: string;
    botId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    return this.request<{ calls: any[]; pagination: any }>("/calls", {
      params,
    });
  }

  async getCall(callId: string) {
    return this.request<{ call: any }>(`/call/${callId}`);
  }

  async initiateCall(patientId: string, callData: any): Promise<OpenMicCall> {
    try {
      return this.request("/calls", {
        method: "POST",
        data: { patientId, ...callData },
      });
    } catch (error) {
      console.error("Error initiating call:", error);
      throw new Error("Failed to initiate call");
    }
  }

  async getPatients() {
    return this.request<{ patients: any[] }>("/patients");
  }

  async getAppointments(medicalId: string) {
    return this.request<{ appointments: any[] }>(`/appointments/${medicalId}`);
  }

  async getPatient(medicalId: string) {
    return this.request<{ patient: any }>(`/patients/${medicalId}`);
  }

  async createPatient(data: any) {
    return this.request<{ patient: any }>("/patients", {
      method: "POST",
      data,
    });
  }

  async updatePatient(medicalId: string, data: any) {
    return this.request<{ patient: any }>(`/patients/${medicalId}`, {
      method: "PUT",
      data,
    });
  }

  async deletePatient(medicalId: string) {
    return this.request<{ message: string }>(`/patients/${medicalId}`, {
      method: "DELETE",
    });
  }

  async getAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    botId?: string;
  }) {
    return this.request<{ analytics: any }>("/analytics", {
      params,
    });
  }

  async getCallMetrics(callId: string) {
    return this.request<{ metrics: any }>(`/calls/${callId}/metrics`);
  }
}

export const apiClient = new ApiClient();
