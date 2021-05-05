import translations from './src/translations/index.mjs'

const langs = Object.getOwnPropertyNames(translations);

let en_keys = [...new Map(Object.entries(translations.en)).keys()];

function arrayDiff(a, b) {
  return {
    missing: a.filter(x => !b.includes(x)),
    extra: b.filter(x => !a.includes(x)),
  };
}

for (let lang_num in langs) {
  let lang = new Map(Object.entries(translations[langs[lang_num]]));
  if (lang == "en") continue;
  let lang_keys = [...lang.keys()];
  let di = arrayDiff(en_keys, [...lang.keys()])
  console.log("Language Code:", langs[lang_num])
  console.log("Language Name:", translations[langs[lang_num]]["language_name"])

  console.log("\tPercent Translated:", Math.round((en_keys.length - di.missing.length) / en_keys.length * 100))
  if (di.missing.length > 0) {
    console.log("\tMissing: ", di.missing.join(", "))
  }
  if (di.extra.length > 0) {
    console.log("\tExtra Keys (maybe deprecated, renamed or no longer exists, check git log): ", di.extra.join(", "))
  }
}
