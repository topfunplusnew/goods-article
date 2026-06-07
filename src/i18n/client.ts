import {
  I18N_LOCALE_STORAGE_KEY,
  type SupportedLocale,
} from "@/config/locale";

export function readStoredLocale(): SupportedLocale | null {
  try {
    const value = localStorage.getItem(I18N_LOCALE_STORAGE_KEY);
    return value === "en" || value === "zh" ? value : null;
  } catch {
    return null;
  }
}

export function writeStoredLocale(locale: SupportedLocale): void {
  try {
    localStorage.setItem(I18N_LOCALE_STORAGE_KEY, locale);
  } catch {
    // Keep locale switching usable when storage writes fail.
  }
}
