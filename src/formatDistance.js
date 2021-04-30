import { de, enGB, fr, nl, ru, it } from 'date-fns/locale'
import { formatDistance as formatDistanceReal} from 'date-fns';

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