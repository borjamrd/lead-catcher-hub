
import { create } from 'zustand';

interface OppositionState {
  currentSelectedOppositionId: string | null;
  setCurrentOppositionId: (id: string | null) => void;
}

export const useOppositionStore = create<OppositionState>((set) => ({
  currentSelectedOppositionId: null,
  setCurrentOppositionId: (id) => set({ currentSelectedOppositionId: id }),
}));
