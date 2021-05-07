import { Margin } from "../elements/Margin.js";
import { Page } from "../types/Page.js";
import { changePage, setPageContent } from "../pageUtils";
import { makeElement } from "../htmlUtils";
import { pageState } from "../globalPageState.ts";
import i18next from 'i18next';
import translations from "../translations/index.mjs";

let languageIDs = Object.getOwnPropertyNames(translations);

export class SetLanguagePage extends Page {
  constructor() {
    super();
  }
  render() {
    let setLanguageForm = makeElement({
      tag: "form",
      id: "setLanguageForm",
      children: [
        Margin(makeElement({
          tag: "select",
          class: ["uk-select", "uk-form-width-large"],
          attributes: {
            name: "language"
          },
          children: languageIDs.map(function (languageID) {
            return makeElement({
              tag: "option",
              text: i18next.getFixedT(languageID, null)("language_name"),
              attributes: { value: languageID }
            })
          })
        })
        ),
        makeElement({
          tag: "p",
          id: "errorText",
          class: "uk-text-danger"
        }),
        makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: i18next.t("set_language_btn"),
          attributes: {
            type: "submit",
          }
        })
      ]
    });
    setPageContent(setLanguageForm);
    setLanguageForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let formData = new FormData(setLanguageForm);
      let language = formData.get("language");
      pageState.language = language;
      console.log(pageState.language);
      i18next.changeLanguage(language).then((t) => {
        changePage("HOME", false);
        pageState.pageDirection = t("language_direction");
        location.reload();
      });
    });
  }
  get name() {
    return i18next.t("set_language_title");
  }
}
