import { de, enGB, fr, it, nl, ru } from 'date-fns/locale'
import { formatDistance as formatDistanceReal} from 'date-fns';
import { pageState } from "./globalPageState.ts";

function getLocale() {
  return {
    "en": enGB,
    "fr": fr,
    "nl": nl,
    "ru": ru,
    "de": de,
    "it": it,
  }[pageState.language];
}

export function formatDistance(d1, d2) {
  return formatDistanceReal(d1, d2, { locale: getLocale() });
} 