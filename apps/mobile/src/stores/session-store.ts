import { create } from "zustand";

type SessionState = {
  activeSessionId: string | null;
  activeWorld: string | null;
  setActiveSession: (sessionId: string | null, world?: string | null) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  activeSessionId: null,
  activeWorld: null,
  setActiveSession: (activeSessionId, activeWorld = null) =>
    set({ activeSessionId, activeWorld }),
}));
