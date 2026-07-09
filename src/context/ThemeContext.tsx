import React from "react";
import { darkTheme, lightTheme, type AppTheme, type ThemeMode } from "../theme/colors";
import { loadThemeMode, saveThemeMode } from "../services/storage";

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<ThemeMode>("light");

  React.useEffect(() => {
    loadThemeMode().then((saved) => {
      if (saved) setMode(saved);
    });
  }, []);

  function toggleTheme() {
    setMode((current) => {
      const next = current === "light" ? "dark" : "light";
      saveThemeMode(next);
      return next;
    });
  }

  const theme = mode === "dark" ? darkTheme : lightTheme;
  const value: ThemeContextValue = { theme, mode, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme deve essere usato dentro un ThemeProvider");
  }
  return ctx;
}