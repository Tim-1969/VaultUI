// @ts-ignore
import translations from "../translations/index.mjs";
// ts-unignore

import { Form } from "../elements/ReactForm";
import { Margin } from "../elements/ReactMargin";
import { MarginInline } from "../elements/ReactMarginInline";
import { Page } from "../types/Page";
import { reloadNavBar } from "../elements/NavBar";
import { render } from "preact";
import i18next from "i18next";

const languageIDs = Object.getOwnPropertyNames(translations);

export class SetLanguagePage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    render(
      <Form onSubmit={(data) => this.onSubmit(data)}>
        <Margin>
          <select class="uk-select uk-form-width-large" name="language">
            {languageIDs.map((languageID) => (
              <option value={languageID}>
                {i18next.getFixedT(languageID, null)("language_name")}
              </option>
            ))}
          </select>
        </Margin>
        <p class="uk-text-danger" id="errorText" />
        <MarginInline>
          <button class="uk-button uk-button-primary" type="submit">
            {i18next.t("set_language_btn")}
          </button>
        </MarginInline>
      </Form>,
      this.router.pageContentElement,
    );
  }

  async onSubmit(data: FormData): Promise<void> {
    const language = data.get("language") as string;
    this.state.language = language;

    const t = await i18next.changeLanguage(language);
    this.state.pageDirection = t("language_direction");
    reloadNavBar(this.router);
    await this.router.changePage("HOME");
  }

  get name(): string {
    return i18next.t("set_language_title");
  }
}
