import type { Metadata } from "next";
import "./globals.css";

import { buildBaseMetadata } from "@/config/seo";
import { getServerLocale } from "@/i18n/server";
import { themeTokens } from "@/config/theme";

export const metadata: Metadata = buildBaseMetadata();

const themeStyle = {
  "--site-primary": themeTokens.colors.primary,
  "--site-primary-dark": themeTokens.colors.primaryDark,
  "--site-primary-light": themeTokens.colors.primaryLight,
  "--site-primary-subtle": themeTokens.colors.primarySubtle,
  "--site-accent": themeTokens.colors.accent,
  "--site-accent-dark": themeTokens.colors.accentDark,
  "--site-surface": themeTokens.colors.surface,
  "--site-surface-subtle": themeTokens.colors.surfaceSubtle,
  "--site-border": themeTokens.colors.border,
  "--site-text": themeTokens.colors.text,
  "--site-text-muted": themeTokens.colors.textMuted,
  "--site-white": themeTokens.colors.white,
  "--site-font-sans": themeTokens.fonts.sans,
  "--site-font-serif": themeTokens.fonts.serif,
  "--site-radius-card": themeTokens.radius.card,
  "--site-radius-chip": themeTokens.radius.chip,
  "--site-radius-pill": themeTokens.radius.pill,
  "--site-shadow-panel": themeTokens.shadows.panel,
  "--site-container-page": themeTokens.container.page,
} as React.CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getServerLocale();

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en-US"} className="h-full antialiased" style={themeStyle}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
