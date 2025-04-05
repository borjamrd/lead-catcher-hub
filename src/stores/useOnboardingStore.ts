
import { create } from 'zustand';
import { Json } from '@/integrations/supabase/types';

export interface OnboardingInfo {
  id: string;
  user_id: string;
  available_hours: number;
  study_days: number;
  objectives: Json | null;
  created_at: string;
  opposition_id: string | null;
}

interface OnboardingState {
  onboardingInfo: OnboardingInfo | null;
  setOnboardingInfo: (info: OnboardingInfo) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  onboardingInfo: null,
  setOnboardingInfo: (info) => set({ onboardingInfo: info }),
}));
