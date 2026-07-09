export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
};

export const colors = {
  background: "#fffaf5",
  surface: "#ffffff",
  textPrimary: "#2f2a24",
  textSecondary: "#7a6f65",
  accent: "#c0392b",
  accentBackground: "#fff7eb",
  accentBorder: "#f2d2a2",
  warning: "#f0b46e",
  warningBackground: "#fff2e2",
  warningText: "#8a4b12",
  error: "#b42318",
};

export const theme = { colors, spacing };

export type Theme = typeof theme;