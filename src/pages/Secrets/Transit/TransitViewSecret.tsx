import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { Tile } from "../../../elements/ReactTile";
import { getTransitKey } from "../../../api/transit/getTransitKey";
import { render } from "preact";
import i18next from "i18next";

export class TransitViewSecretPage extends Page {
  constructor() {
    super();
  }

  async goBack(): Promise<void> {
    await this.router.changePage("TRANSIT_VIEW");
  }

  async render(): Promise<void> {
    const transitKey = await getTransitKey(this.state.baseMount, this.state.secretItem);

    render(
      <div class="uk-child-width-1-1@s uk-child-width-1-2@m uk-grid-small uk-grid-match" uk-grid>
        {transitKey.supports_encryption && (
          <Tile
            title={i18next.t("transit_view_encrypt_text")}
            description={i18next.t("transit_view_encrypt_description")}
            icon="lock"
            iconText={i18next.t("transit_view_encrypt_icon_text")}
            onclick={async () => await this.router.changePage("TRANSIT_ENCRYPT")}
          />
        )}
        {transitKey.supports_decryption && (
          <Tile
            title={i18next.t("transit_view_decrypt_text")}
            description={i18next.t("transit_view_decrypt_description")}
            icon="mail"
            iconText={i18next.t("transit_view_decrypt_icon_text")}
            onclick={async () => await this.router.changePage("TRANSIT_DECRYPT")}
          />
        )}
        {transitKey.supports_decryption && (
          <Tile
            title={i18next.t("transit_view_rewrap_text")}
            description={i18next.t("transit_view_rewrap_description")}
            icon="code"
            iconText={i18next.t("transit_view_rewrap_icon_text")}
            onclick={async () => await this.router.changePage("TRANSIT_REWRAP")}
          />
        )}
      </div>,
      this.router.pageContentElement,
    );
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router);
  }

  get name(): string {
    return i18next.t("transit_view_secret_title");
  }
}
