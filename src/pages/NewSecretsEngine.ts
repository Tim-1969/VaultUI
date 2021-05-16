import { Page } from "../types/Page";
import { Tile } from "../elements/Tile";
import { makeElement } from "../htmlUtils";
import i18next from "i18next";

export class NewSecretsEnginePage extends Page {
  constructor() {
    super();
  }

  async render(): Promise<void> {
    await this.router.setPageContent(
      makeElement({
        tag: "div",
        class: "uk-child-width-1-1@s uk-child-width-1-2@m uk-grid-small uk-grid-match",
        attributes: { "uk-grid": "" },
        children: [
          Tile({
            title: i18next.t("new_secrets_engine_kv_title"),
            description: i18next.t("new_secrets_engine_kv_description"),
            onclick: async () => {
              await this.router.changePage("NEW_KV_ENGINE");
            },
          }),
          Tile({
            title: i18next.t("new_secrets_engine_totp_title"),
            description: i18next.t("new_secrets_engine_totp_description"),
            onclick: async () => {
              await this.router.changePage("NEW_TOTP_ENGINE");
            },
          }),
          Tile({
            title: i18next.t("new_secrets_engine_transit_title"),
            description: i18next.t("new_secrets_engine_transit_description"),
            onclick: async () => {
              await this.router.changePage("NEW_TRANSIT_ENGINE");
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
