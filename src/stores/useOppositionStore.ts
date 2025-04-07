
import { create } from 'zustand';

interface OppositionState {
  currentSelectedOppositionId: string | null;
  currentSelectedOpposition: string | null;
  setCurrentSelectedOpposition: (id: string | null) => void;
  onboardingSelectedOppositionId: string | null;
  setCurrentOppositionId: (id: string | null) => void;
  setOnboardingOppositionId: (id: string | null) => void;
}

export const useOppositionStore = create<OppositionState>((set) => ({
  currentSelectedOppositionId: null,
  onboardingSelectedOppositionId: null,
  currentSelectedOpposition: null,
  setCurrentSelectedOpposition: (id) => set({ currentSelectedOpposition: id }),
  setCurrentOppositionId: (id) => set({ currentSelectedOppositionId: id }),
  setOnboardingOppositionId: (id) => set({ onboardingSelectedOppositionId: id }),
}));
