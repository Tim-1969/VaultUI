import { Grid, GridSizes } from "../../elements/Grid";
import { Page } from "../../types/Page";
import { Tile } from "../../elements/Tile";
import { render } from "preact";
import i18next from "i18next";

export class NewSecretsEnginePage extends Page {
  constructor() {
    super();
  }

  async render(): Promise<void> {
    render(
      <Grid size={GridSizes.MATCHING_TWO_ROWS}>
        <Tile
          title={i18next.t("new_secrets_engine_kv_title")}
          description={i18next.t("new_secrets_engine_kv_description")}
          onclick={async () => {
            await this.router.changePage("NEW_KV_ENGINE");
          }}
        />
        <Tile
          title={i18next.t("new_secrets_engine_totp_title")}
          description={i18next.t("new_secrets_engine_totp_description")}
          onclick={async () => {
            await this.router.changePage("NEW_TOTP_ENGINE");
          }}
        />
        <Tile
          title={i18next.t("new_secrets_engine_transit_title")}
          description={i18next.t("new_secrets_engine_transit_description")}
          onclick={async () => {
            await this.router.changePage("NEW_TRANSIT_ENGINE");
          }}
        />
      </Grid>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("new_secrets_engine_title");
  }
}
