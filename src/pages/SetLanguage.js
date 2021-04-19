import { Page } from "../types/Page.js";
import { setPageContent, changePage } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import { Margin } from "../elements/Margin.js";
import i18next from 'i18next';

let languages = ["en", "de", "nl", "ru"];

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
          children: languages.map(function (languageID) {
            return makeElement({
              tag: "option",
              text: i18next.getFixedT(languageID, null)("language_name"),
              value: languageID
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
      localStorage.setItem('language', language);
      i18next.changeLanguage(language).then((t) => {
          changePage("HOME", false);
          location.reload();
      });
    });
  }
  get name() {
    return i18next.t("set_language_title");
  }
}
