import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  profile: any | null;
  setSession: (session: Session | null) => void;
  setProfile: (profile: any | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  signOut: () => set({ session: null, profile: null }),
}));
