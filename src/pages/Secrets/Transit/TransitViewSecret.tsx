import { Grid, GridSizes } from "../../../elements/Grid";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { Tile } from "../../../elements/Tile";
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
      <Grid size={GridSizes.MATCHING_TWO_ROWS}>
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
      </Grid>,
      this.router.pageContentElement,
    );
  }

  async renderPageTitle(): Promise<void> {
    render(<SecretTitleElement page={this} />, this.router.pageTitleElement);
  }

  get name(): string {
    return i18next.t("transit_view_secret_title");
  }
}
