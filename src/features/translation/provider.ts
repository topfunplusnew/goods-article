export type TranslationProvider = "google_gtx";

interface TranslationProviderEnv {
  LOCALE_TRANSLATION_PROVIDER?: string | undefined;
}

export function readTranslationProvider(
  env: TranslationProviderEnv,
): TranslationProvider {
  const value = env.LOCALE_TRANSLATION_PROVIDER;

  if (!value || value.trim().length === 0) {
    throw new Error(
      "Missing required environment variable LOCALE_TRANSLATION_PROVIDER.",
    );
  }

  if (value === "google_gtx") {
    return value;
  }

  throw new Error(`Unsupported translation provider: ${value}`);
}
