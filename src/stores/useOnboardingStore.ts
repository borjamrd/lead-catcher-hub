
import { create } from 'zustand';

interface OnboardingInfo {
  id: string;
  user_id: string;
  available_hours: number;
  study_days: number;
  objectives: any; // Using any for jsonb type
  created_at?: string;
}

interface OnboardingState {
  onboardingInfo: OnboardingInfo | null;
  setOnboardingInfo: (info: OnboardingInfo) => void;
  clearOnboardingInfo: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  onboardingInfo: null,
  setOnboardingInfo: (info) => set({ onboardingInfo: info }),
  clearOnboardingInfo: () => set({ onboardingInfo: null }),
}));
