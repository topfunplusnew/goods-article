import { AUTH_TOKEN_COOKIE_NAME } from "@/config/auth";

export function readAuthTokenFromCookieHeader(
  cookieHeader: string | null | undefined,
): string | null {
  if (!cookieHeader) {
    return null;
  }

  const parts = cookieHeader.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${AUTH_TOKEN_COOKIE_NAME}=`));

  return match ? match.slice(`${AUTH_TOKEN_COOKIE_NAME}=`.length) : null;
}

export function resolveSafeRedirectTarget(value: string | null | undefined): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/";
}
