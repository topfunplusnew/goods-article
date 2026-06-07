export const themeTokens = {
  colors: {
    primary: "#2563eb",
    primaryDark: "#1e293b",
    primaryLight: "#3b82f6",
    primarySubtle: "#eff6ff",
    accent: "#0ea5e9",
    accentDark: "#0284c7",
    surface: "#f1f5f9",
    surfaceSubtle: "#e2e8f0",
    border: "#cbd5e1",
    text: "#374151",
    textMuted: "#6b7280",
    white: "#ffffff",
  },
  fonts: {
    sans: "'Source Sans 3', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    serif: "'Source Serif 4', Georgia, 'Times New Roman', serif",
  },
  radius: {
    card: "0.75rem",
    chip: "0.375rem",
    pill: "9999px",
  },
  shadows: {
    panel: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  container: {
    page: "1320px",
  },
} as const;
