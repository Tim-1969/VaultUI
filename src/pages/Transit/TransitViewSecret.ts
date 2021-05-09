import { Page } from "../../types/Page";
import { changePage, setPageContent, setTitleElement } from "../../pageUtils";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import i18next from 'i18next';
import { getTransitKey } from "../../api/transit/getTransitKey";
import { Tile } from "../../elements/Tile";

export class TransitViewSecretPage extends Page {
  constructor() {
    super();
  }

  goBack(): void {
    changePage("TRANSIT_VIEW");
  }

  async render(): Promise<void> {
    setTitleElement(pageState);

    let transitKey = await getTransitKey(pageState.currentBaseMount, pageState.currentSecret);

    setPageContent(makeElement({
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
          onclick: () => { changePage("TRANSIT_ENCRYPT"); }
        }),
        Tile({
          condition: transitKey.supports_decryption,
          title: i18next.t("transit_view_decrypt_text"),
          description: i18next.t("transit_view_decrypt_description"),
          icon: "mail",
          iconText: i18next.t("transit_view_decrypt_icon_text"),
          onclick: () => { changePage("TRANSIT_DECRYPT"); }
        }),
      ]
    }));
  }

  get name(): string {
    return i18next.t("transit_view_secret_title");
  }
}