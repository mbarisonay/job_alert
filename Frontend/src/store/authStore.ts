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
  updateUser: (partial: Partial<AuthUser>) => void;
}

const STORAGE_KEY = "auth";

function loadFromStorage(): {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null, isAuthenticated: false };
    const { token, user } = JSON.parse(raw) as {
      token: string;
      user: AuthUser;
    };
    if (token && user) {
      return { token, user, isAuthenticated: true };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { token: null, user: null, isAuthenticated: false };
}

const initial = loadFromStorage();

export const useAuthStore = create<AuthState>((set, get) => ({
  token: initial.token,
  user: initial.user,
  isAuthenticated: initial.isAuthenticated,

  login: (token, user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, user: null, isAuthenticated: false });
  },

  updateUser: (partial) => {
    const { token, user } = get();
    if (!user || !token) return;
    const updated = { ...user, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: updated }));
    set({ user: updated });
  },
}));
