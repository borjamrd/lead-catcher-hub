import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  isOnboardingDone: boolean;
  setOnboardingDone: (done: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      onboardingInfo: null,
      setOnboardingInfo: (info) => set({ onboardingInfo: info }),
      isOnboardingDone: false,
      setOnboardingDone: (done) => set({ isOnboardingDone: done }),
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({ isOnboardingDone: state.isOnboardingDone }), // solo persistimos este flag
    }
  )
);
