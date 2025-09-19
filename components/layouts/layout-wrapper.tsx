"use client";

import type React from "react";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Navigation } from "./navigation";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { setBots, setCalls, setPatients } = useAppStore();

  useEffect(() => {
    initializeAppData();
  }, []);

  const initializeAppData = async () => {
    try {
      const [botsData, callsData, patientsData] = await Promise.allSettled([
        apiClient.getBots(),
        apiClient.getCalls(),
        apiClient.getPatients(),
      ]);

      // Handle successful responses
      if (botsData.status === "fulfilled") {
        setBots(botsData.value.bots || []);
      }
      if (callsData.status === "fulfilled") {
        setCalls(callsData.value.calls || []);
      }
      if (patientsData.status === "fulfilled") {
        setPatients(patientsData.value.patients || []);
      }
    } catch (error) {
      console.error("Error initializing app data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
