import { create } from 'zustand'

interface SessionState {
  userId: string | null
  setUserId: (id: string | null) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
}))
