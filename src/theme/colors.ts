export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
};

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  background: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryBackground: string;
  primaryBorder: string;
  warning: string;
  warningBackground: string;
  warningText: string;
  error: string;
}

const lightColors: ThemeColors = {
  background: "#fffaf5",
  surface: "#ffffff",
  border: "#f0e4d7",
  text: "#2f2a24",
  textSecondary: "#7a6f65",
  primary: "#c0392b",
  primaryBackground: "#fff7eb",
  primaryBorder: "#f2d2a2",
  warning: "#f0b46e",
  warningBackground: "#fff2e2",
  warningText: "#8a4b12",
  error: "#b42318",
};

const darkColors: ThemeColors = {
  background: "#121212",
  surface: "#1e1e1e",
  border: "#3a3530",
  text: "#f5efe8",
  textSecondary: "#c9beb2",
  primary: "#ff6f5e",
  primaryBackground: "#3a241e",
  primaryBorder: "#5c362b",
  warning: "#f0b46e",
  warningBackground: "#3a2e1c",
  warningText: "#f0c896",
  error: "#ff6b5b",
};

export interface AppTheme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: typeof spacing;
}

export const lightTheme: AppTheme = { mode: "light", colors: lightColors, spacing };
export const darkTheme: AppTheme = { mode: "dark", colors: darkColors, spacing };

export type Theme = AppTheme;