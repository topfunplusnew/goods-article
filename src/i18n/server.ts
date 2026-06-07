import enDictionary from "@/i18n/dictionaries/en.json";
import zhDictionary from "@/i18n/dictionaries/zh.json";
import {
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@/config/locale";

export type Dictionary = typeof enDictionary;

const DICTIONARIES: Record<SupportedLocale, Dictionary> = {
  en: enDictionary,
  zh: zhDictionary,
};

export async function getDictionary(locale: SupportedLocale): Promise<Dictionary> {
  return DICTIONARIES[locale];
}

export function getServerLocale(): SupportedLocale {
  return DEFAULT_LOCALE;
}
