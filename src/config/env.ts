export interface ServerEnv {
  backendOrigin: string;
  publicSiteUrl: string;
  publicApiBaseUrl: string;
  internalApiBaseUrl: string;
  localeTranslateEnabled: boolean;
  deeplAuthKey: string;
  deeplApiUrl: string;
  googleTranslateApiKey: string;
}

function readRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

export function getServerEnv(): ServerEnv {
  return {
    backendOrigin: readRequiredEnv("BACKEND_ORIGIN"),
    publicSiteUrl: readRequiredEnv("NEXT_PUBLIC_SITE_URL"),
    publicApiBaseUrl: readRequiredEnv("NEXT_PUBLIC_API_BASE_URL"),
    internalApiBaseUrl: readRequiredEnv("INTERNAL_API_BASE_URL"),
    localeTranslateEnabled: process.env.NEXT_PUBLIC_LOCALE_TRANSLATE === "true",
    deeplAuthKey: process.env.DEEPL_AUTH_KEY?.trim() ?? "",
    deeplApiUrl: process.env.DEEPL_API_URL?.trim() || "https://api-free.deepl.com",
    googleTranslateApiKey: process.env.GOOGLE_TRANSLATE_API_KEY?.trim() ?? "",
  };
}
