import { create } from "zustand";
import { useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme:
    typeof localStorage !== "undefined"
      ? (localStorage.getItem("theme") as Theme) || "dark"
      : "dark",

  setTheme: (theme: Theme) => {
    set({ theme });
    localStorage.setItem("theme", theme);

    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = current === "dark" ? "light" : "dark";
    get().setTheme(next);
  },
}));

// Hook to initialize theme on app load
export function useThemeInit() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme, setTheme]);
}
