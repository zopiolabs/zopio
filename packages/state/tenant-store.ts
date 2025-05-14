import { create } from 'zustand'

interface TenantState {
  tenantId: string | null
  setTenantId: (id: string | null) => void
}

export const useTenantStore = create<TenantState>((set) => ({
  tenantId: null,
  setTenantId: (id) => set({ tenantId: id }),
}))
