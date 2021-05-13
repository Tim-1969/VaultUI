import { Page } from "../types/Page";
import { Tile } from "../elements/Tile";
import { changePage, setPageContent, setTitleElement } from "../pageUtils";
import { makeElement } from "../htmlUtils";
import i18next from "i18next";

export class NewSecretsEnginePage extends Page {
  constructor() {
    super();
  }

  async render(): Promise<void> {
    setPageContent(
      makeElement({
        tag: "div",
        class: "uk-child-width-1-1@s uk-child-width-1-2@m uk-grid-small uk-grid-match",
        attributes: { "uk-grid": "" },
        children: [
          Tile({
            title: i18next.t("new_secrets_engine_kv_title"),
            description: i18next.t("new_secrets_engine_kv_description"),
            onclick: () => {
              void changePage("NEW_KV_ENGINE");
            },
          }),
        ],
      }),
    );
  }

  get name(): string {
    return i18next.t("new_secrets_engine_title");
  }
}
