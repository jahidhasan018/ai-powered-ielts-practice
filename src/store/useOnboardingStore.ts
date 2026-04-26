import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StudyPreferences {
  currentLevel: string;
  targetBand: number | null;
  durationWeeks: number;
  dailyStudyTime: number; // minutes
  focusSkills: string[];
}

interface OnboardingState {
  step: number;
  preferences: StudyPreferences;
  setStep: (step: number) => void;
  updatePreferences: (updates: Partial<StudyPreferences>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 0,
      preferences: {
        currentLevel: '',
        targetBand: null,
        durationWeeks: 4,
        dailyStudyTime: 60,
        focusSkills: [],
      },
      setStep: (step) => set({ step }),
      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),
      reset: () =>
        set({
          step: 0,
          preferences: {
            currentLevel: '',
            targetBand: null,
            durationWeeks: 4,
            dailyStudyTime: 60,
            focusSkills: [],
          },
        }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
