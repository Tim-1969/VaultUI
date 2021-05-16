import { Margin } from "../elements/Margin";
import { Page } from "../types/Page";
import { makeElement } from "../htmlUtils";
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
    await this.router.setPageContent(setLanguageForm);
    setLanguageForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(setLanguageForm);

      const language = formData.get("language") as string;
      this.state.language = language;

      const t = await i18next.changeLanguage(language);
      this.state.pageDirection = t("language_direction");
      reloadNavBar(this.router);
      await this.router.changePage("HOME");
    });
  }
  get name(): string {
    return i18next.t("set_language_title");
  }
}

export { SetLanguagePage as default };
