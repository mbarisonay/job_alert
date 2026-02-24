import { create } from "zustand";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  dateOfBirth?: string | null;
};

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  hydrate: () => void;
}

const STORAGE_KEY = "auth";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token, user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, user: null, isAuthenticated: false });
  },

  hydrate: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const { token, user } = JSON.parse(raw) as {
        token: string;
        user: AuthUser;
      };
      if (token && user) {
        set({ token, user, isAuthenticated: true });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
}));
