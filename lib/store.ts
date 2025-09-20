import { create } from "zustand";
import { IBot } from "@/models/bot.model";
import { ICall } from "@/models/call.model";
import { IPatient } from "@/models/patient.model";

interface AppState {
  bots: IBot[];
  selectedBot: IBot | null;
  isLoadingBots: boolean;

  calls: ICall[];
  selectedCall: ICall | null;
  isLoadingCalls: boolean;

  patients: IPatient[];
  selectedPatient: IPatient | null;
  isLoadingPatients: boolean;

  setBots: (bots: IBot[]) => void;
  setSelectedBot: (bot: IBot | null) => void;
  setIsLoadingBots: (loading: boolean) => void;
  addBot: (bot: IBot) => void;
  updateBot: (id: string, bot: Partial<IBot>) => void;
  removeBot: (id: string) => void;

  setCalls: (calls: ICall[]) => void;
  setSelectedCall: (call: ICall | null) => void;
  setIsLoadingCalls: (loading: boolean) => void;
  addCall: (call: ICall) => void;

  setPatients: (patients: IPatient[]) => void;
  setSelectedPatient: (patient: IPatient | null) => void;
  setIsLoadingPatients: (loading: boolean) => void;
  addPatient: (patient: IPatient) => void;
}

export const useAppStore = create<AppState>((set) => ({
  bots: [],
  selectedBot: null,
  isLoadingBots: false,

  calls: [],
  selectedCall: null,
  isLoadingCalls: false,

  patients: [],
  selectedPatient: null,
  isLoadingPatients: false,

  setBots: (bots) => set({ bots }),
  setSelectedBot: (bot) => set({ selectedBot: bot }),
  setIsLoadingBots: (loading) => set({ isLoadingBots: loading }),
  addBot: (bot) => set((state) => ({ bots: [bot, ...state.bots] })),
  updateBot: (id, updatedBot) =>
    set((state) => ({
      bots: state.bots.map((bot) =>
        bot._id === id ? ({ ...bot, ...updatedBot } as IBot) : bot
      ),
    })),
  removeBot: (id) =>
    set((state) => ({
      bots: state.bots.filter((bot) => bot._id !== id),
    })),

  setCalls: (calls) => set({ calls }),
  setSelectedCall: (call) => set({ selectedCall: call }),
  setIsLoadingCalls: (loading) => set({ isLoadingCalls: loading }),
  addCall: (call) => set((state) => ({ calls: [call, ...state.calls] })),

  setPatients: (patients) => set({ patients }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  setIsLoadingPatients: (loading) => set({ isLoadingPatients: loading }),
  addPatient: (patient) =>
    set((state) => ({ patients: [patient, ...state.patients] })),
}));
