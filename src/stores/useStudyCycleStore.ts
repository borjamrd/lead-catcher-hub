// stores/useStudyCycleStore.ts

import { create } from 'zustand';

interface StudyCycleStore {
  selectedCycleId: string | null;
  setSelectedCycleId: (id: string) => void;
  clearCycle: () => void;
}

export const useStudyCycleStore = create<StudyCycleStore>((set) => ({
  selectedCycleId: null,
  setSelectedCycleId: (id) => set({ selectedCycleId: id }),
  clearCycle: () => set({ selectedCycleId: null }),
}));
