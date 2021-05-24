import { AuthMethod } from "../../../api/types/auth";
import { HeaderAndContent } from "../../../elements/HeaderAndContent";
import { Page } from "../../../types/Page";
import { listAuth } from "../../../api/auth/listAuth";
import { objectToMap, toStr } from "../../../utils";
import { render } from "preact";
import i18next from "i18next";

export class AuthViewConfigPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("AUTH_HOME");
  }

  async render(): Promise<void> {
    const authList = objectToMap(await listAuth()) as Map<string, AuthMethod>;
    const authMethod = authList.get(this.state.baseMount);

    render(
      <table class="uk-table">
        <tbody>
          <HeaderAndContent title={i18next.t("auth_view_config_type")} content={authMethod.type} />
          <HeaderAndContent
            title={i18next.t("auth_view_config_path")}
            content={this.state.baseMount}
          />
          <HeaderAndContent
            title={i18next.t("auth_view_config_description")}
            content={authMethod.description}
          />
          <HeaderAndContent
            title={i18next.t("auth_view_config_accessor")}
            content={authMethod.accessor}
          />
          <HeaderAndContent
            title={i18next.t("auth_view_config_local")}
            content={toStr(authMethod.local)}
          />
          <HeaderAndContent
            title={i18next.t("auth_view_config_seal_wrap")}
            content={toStr(authMethod.seal_wrap)}
          />
          <HeaderAndContent
            title={i18next.t("auth_view_config_list_when_unauth")}
            content={toStr(authMethod.config.listing_visibility)}
          />
          <HeaderAndContent
            title={i18next.t("auth_view_config_default_lease_ttl")}
            content={toStr(authMethod.config.default_lease_ttl)}
          />
          <HeaderAndContent
            title={i18next.t("auth_view_config_max_lease_ttl")}
            content={toStr(authMethod.config.max_lease_ttl)}
          />
          <HeaderAndContent
            title={i18next.t("auth_view_config_token_type")}
            content={toStr(authMethod.config.token_type)}
          />
        </tbody>
      </table>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("auth_view_config_title");
  }
}
