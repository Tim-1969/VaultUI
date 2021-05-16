import { Page } from "../../types/Page";
import { SecretTitleElement } from "../../elements/SecretTitleElement";
import { Tile } from "../../elements/Tile";
import { getTransitKey } from "../../api/transit/getTransitKey";
import { makeElement } from "../../htmlUtils";
import i18next from "i18next";

export class TransitViewSecretPage extends Page {
  constructor() {
    super();
  }

  async goBack(): Promise<void> {
    await this.router.changePage("TRANSIT_VIEW");
  }

  async render(): Promise<void> {
    const transitKey = await getTransitKey(this.state.currentBaseMount, this.state.currentSecret);

    await this.router.setPageContent(
      makeElement({
        tag: "div",
        class: "uk-child-width-1-1@s uk-child-width-1-2@m uk-grid-small uk-grid-match",
        attributes: { "uk-grid": "" },
        children: [
          Tile({
            condition: transitKey.supports_encryption,
            title: i18next.t("transit_view_encrypt_text"),
            description: i18next.t("transit_view_encrypt_description"),
            icon: "lock",
            iconText: i18next.t("transit_view_encrypt_icon_text"),
            onclick: async () => {
              await this.router.changePage("TRANSIT_ENCRYPT");
            },
          }),
          Tile({
            condition: transitKey.supports_decryption,
            title: i18next.t("transit_view_decrypt_text"),
            description: i18next.t("transit_view_decrypt_description"),
            icon: "mail",
            iconText: i18next.t("transit_view_decrypt_icon_text"),
            onclick: async () => {
              await this.router.changePage("TRANSIT_DECRYPT");
            },
          }),
          Tile({
            condition: transitKey.supports_decryption,
            title: i18next.t("transit_view_rewrap_text"),
            description: i18next.t("transit_view_rewrap_description"),
            icon: "code",
            iconText: i18next.t("transit_view_rewrap_icon_text"),
            onclick: async () => {
              await this.router.changePage("TRANSIT_REWRAP");
            },
          }),
        ],
      }),
    );
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router);
  }

  get name(): string {
    return i18next.t("transit_view_secret_title");
  }
}
