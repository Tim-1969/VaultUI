import { Grid, GridSizes } from "../../elements/Grid";
import { Page } from "../../types/Page";
import { Tile } from "../../elements/Tile";
import { notImplemented, prePageChecks } from "../../pageUtils";
import { render } from "preact";
import i18next from "i18next";

export class AccessHomePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("HOME");
  }
  async render(): Promise<void> {
    this.router.pageContentElement.innerHTML = "";
    if (!(await prePageChecks(this.router))) return;

    render(
      <Grid size={GridSizes.MATCHING_TWO_ROWS}>
        <Tile
          title={i18next.t("access_auth_methods_title")}
          description={i18next.t("access_auth_methods_description")}
          icon="sign-in"
          onclick={async () => await this.router.changePage("AUTH_HOME")}
        />
        <Tile
          title={i18next.t("access_entities_title")}
          description={i18next.t("access_entities_description")}
          icon="user"
          onclick={async () => notImplemented()}
        />
        <Tile
          title={i18next.t("access_groups_title")}
          description={i18next.t("access_groups_description")}
          icon="users"
          onclick={async () => notImplemented()}
        />
        <Tile
          title={i18next.t("access_leases_title")}
          description={i18next.t("access_leases_description")}
          icon="unlock"
          onclick={async () => notImplemented()}
        />
      </Grid>,
      this.router.pageContentElement,
    );
  }
  get name(): string {
    return i18next.t("access_home_page_title");
  }
}
