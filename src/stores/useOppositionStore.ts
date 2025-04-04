
import { create } from 'zustand';

interface OppositionState {
  currentSelectedOppositionId: string | null;
  onboardingSelectedOppositionId: string | null;
  setCurrentOppositionId: (id: string | null) => void;
  setOnboardingOppositionId: (id: string | null) => void;
}

export const useOppositionStore = create<OppositionState>((set) => ({
  currentSelectedOppositionId: null,
  onboardingSelectedOppositionId: null,
  setCurrentOppositionId: (id) => set({ currentSelectedOppositionId: id }),
  setOnboardingOppositionId: (id) => set({ onboardingSelectedOppositionId: id }),
}));
