import { useSessionStore } from "@/stores/session-store";

export function useSession() {
  const activeSessionId = useSessionStore((s) => s.activeSessionId);
  const activeWorld = useSessionStore((s) => s.activeWorld);
  const setActiveSession = useSessionStore((s) => s.setActiveSession);
  return { activeSessionId, activeWorld, setActiveSession };
}
