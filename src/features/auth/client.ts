"use client";

import { AUTH_TOKEN_COOKIE_NAME } from "@/config/auth";

export function readAuthTokenFromDocument(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${AUTH_TOKEN_COOKIE_NAME}=([^;]*)`),
  );

  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function writeAuthTokenToDocument(token: string): void {
  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=2592000; SameSite=Lax`;
}

export function clearAuthTokenFromDocument(): void {
  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
