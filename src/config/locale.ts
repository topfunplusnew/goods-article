export const SUPPORTED_LOCALES = ["en", "zh"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";
export const I18N_LOCALE_STORAGE_KEY = "article-vue-i18n-locale";
