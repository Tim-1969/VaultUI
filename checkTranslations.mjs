import translation_en from './src/translations/en.js'
import translation_de from './src/translations/de.js'
import translation_ru from './src/translations/ru.js'
import translation_nl from './src/translations/nl.js'
import translation_fr from './src/translations/fr.js'

const langs = ["en", "de", "ru", "nl", "fr"];

const translations_dict = {
  en: translation_en,
  de: translation_de,
  ru: translation_ru,
  nl: translation_nl,
  fr: translation_fr,
}

let en_keys = [...new Map(Object.entries(translations_dict.en)).keys()];

function arrayDiff(a, b) {
  return {
    missing: a.filter(x => !b.includes(x)),
    extra: b.filter(x => !a.includes(x)),
  };
}

for (let lang_num in langs) {
  let lang = new Map(Object.entries(translations_dict[langs[lang_num]]));
  if (lang == "en") continue;
  let lang_keys = [...lang.keys()];
  let di = arrayDiff(en_keys, [...lang.keys()])
  console.log("Language:", langs[lang_num])
  if (di.missing.length > 0) {
    console.log("Missing: ", di.missing.join(", "))
  } 
  if (di.extra.length > 0) {
    console.log("Extra Keys (maybe deprecated, renamed or no longer exists, check git log): ", di.extra.join(", "))
  }
}
