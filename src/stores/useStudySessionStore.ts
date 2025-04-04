import { create } from "zustand";

let timerInterval: NodeJS.Timeout | null = null;

interface StudySessionState {
  isActive: boolean;
  isPaused: boolean;
  startTime: Date | null;
  elapsedSeconds: number;
  selectedSound: string;
  
  // Acciones
  startSession: (soundId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  updateElapsedTime: (seconds: number) => void;
}


export const useStudySessionStore = create<StudySessionState>((set, get) => ({
  isActive: false,
  isPaused: false,
  startTime: null,
  elapsedSeconds: 0,
  selectedSound: "none",

  startSession: (soundId) => {
    const start = new Date();
    set({
      isActive: true,
      isPaused: false,
      startTime: start,
      elapsedSeconds: 0,
      selectedSound: soundId,
    });

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
      set({ elapsedSeconds: diff });
    }, 1000);
  },

  pauseSession: () => {
    set({ isPaused: true });
    if (timerInterval) clearInterval(timerInterval);
  },

  resumeSession: () => {
    set({ isPaused: false });
    const { startTime, elapsedSeconds } = get();
    const resumedAt = new Date();

    if (startTime) {
      const adjustedStart = new Date(resumedAt.getTime() - elapsedSeconds * 1000);
      set({ startTime: adjustedStart });

      timerInterval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - adjustedStart.getTime()) / 1000);
        set({ elapsedSeconds: diff });
      }, 1000);
    }
  },

  endSession: () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;

    set({
      isActive: false,
      isPaused: false,
      startTime: null,
      elapsedSeconds: 0,
      selectedSound: "none",
    });
  },

  updateElapsedTime: (seconds) => set({ elapsedSeconds: seconds }),
}));
