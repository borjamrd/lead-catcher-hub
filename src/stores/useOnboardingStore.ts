
import { create } from 'zustand';

export interface OnboardingInfo {
  id: string;
  user_id: string;
  available_hours: number;
  study_days: number;
  objectives: Record<string, any> | null;
  created_at: string;
}

interface OnboardingState {
  onboardingInfo: OnboardingInfo | null;
  setOnboardingInfo: (info: OnboardingInfo) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  onboardingInfo: null,
  setOnboardingInfo: (info) => set({ onboardingInfo: info }),
}));
