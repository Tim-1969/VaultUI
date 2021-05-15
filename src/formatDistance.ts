import { de, enGB, fr, it, nl, ru } from "date-fns/locale";
import { formatDistance as formatDistanceReal } from "date-fns";

function getLocale(language: string): Locale {
  return {
    en: enGB,
    fr: fr,
    nl: nl,
    ru: ru,
    de: de,
    it: it,
  }[language];
}

export function formatDistance(d1: Date, d2: Date, language: string): string {
  return formatDistanceReal(d1, d2, { locale: getLocale(language) });
}
