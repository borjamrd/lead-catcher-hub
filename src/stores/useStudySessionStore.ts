
import { create } from 'zustand';

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

export const useStudySessionStore = create<StudySessionState>((set) => ({
  isActive: false,
  isPaused: false,
  startTime: null,
  elapsedSeconds: 0,
  selectedSound: "none",
  
  startSession: (soundId) => set({
    isActive: true,
    isPaused: false,
    startTime: new Date(),
    elapsedSeconds: 0,
    selectedSound: soundId
  }),
  
  pauseSession: () => set({ isPaused: true }),
  
  resumeSession: () => set({ isPaused: false }),
  
  endSession: () => set({
    isActive: false,
    isPaused: false,
    startTime: null,
    elapsedSeconds: 0,
    selectedSound: "none"
  }),
  
  updateElapsedTime: (seconds) => set({ elapsedSeconds: seconds })
}));
