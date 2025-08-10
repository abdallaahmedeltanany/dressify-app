import { supabase } from "@/lib/supabase";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkSession: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // ensure we stop loading and return failure
        set({ error: error.message, isLoading: false });
        return false;
      }

      if (data?.user) {
        set({
          user: { id: data.user.id, email: data.user.email || "" },
          isLoading: false,
          error: null,
        });
        return true;
      }

      // No user and no explicit error — treat as failure
      set({ error: "Unknown sign in error", isLoading: false });
      return false;
    } catch (err: any) {
      set({ isLoading: false, error: err?.message ?? "Unexpected error" });
      return false;
    }
  },
  signup: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data && data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user?.email || "",
          },
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },
  checkSession: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (data && data.session) {
        set({
          user: {
            id: data.session.user.id,
            email: data.session.user.email || "",
          },
          isLoading: false,
        });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },
}));
