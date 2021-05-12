import { Margin } from "../elements/Margin";
import { Page } from "../types/Page";
import { changePage, setPageContent } from "../pageUtils";
import { makeElement } from "../htmlUtils";
import { pageState } from "../globalPageState";
import { reloadNavBar } from "../elements/NavBar";
import i18next from "i18next";

// @ts-ignore
import translations from "../translations/index.mjs";

const languageIDs = Object.getOwnPropertyNames(translations);

export class SetLanguagePage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    const setLanguageForm = makeElement({
      tag: "form",
      id: "setLanguageForm",
      children: [
        Margin(
          makeElement({
            tag: "select",
            class: ["uk-select", "uk-form-width-large"],
            attributes: {
              name: "language",
            },
            children: languageIDs.map(function (languageID) {
              return makeElement({
                tag: "option",
                text: i18next.getFixedT(languageID, null)("language_name"),
                attributes: { value: languageID },
              });
            }),
          }),
        ),
        makeElement({
          tag: "p",
          id: "errorText",
          class: "uk-text-danger",
        }),
        makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: i18next.t("set_language_btn"),
          attributes: {
            type: "submit",
          },
        }),
      ],
    }) as HTMLFormElement;
    setPageContent(setLanguageForm);
    setLanguageForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(setLanguageForm);
      const language = formData.get("language") as string;
      pageState.language = language;
      console.log(pageState.language);
      void i18next.changeLanguage(language).then((t) => {
        pageState.pageDirection = t("language_direction");
        reloadNavBar();
        void changePage("HOME");
      });
    });
  }
  get name(): string {
    return i18next.t("set_language_title");
  }
}
