import { create } from 'zustand'

interface FeatureFlagsState {
  flags: Record<string, boolean>
  setFlags: (flags: Record<string, boolean>) => void
}

export const useFeatureFlagsStore = create<FeatureFlagsState>((set) => ({
  flags: {},
  setFlags: (flags) => set({ flags }),
}))
