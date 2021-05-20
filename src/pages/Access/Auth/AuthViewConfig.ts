import { AuthMethod } from "../../../api/types/auth";
import { Page } from "../../../types/Page";
import { listAuth } from "../../../api/auth/listAuth";
import { makeElement } from "z-makeelement";
import { objectToMap } from "../../../utils";
import i18next from "i18next";

export function HeaderAndContent(title: string, content: string): HTMLElement {
  return makeElement({
    tag: "tr",
    children: [
      makeElement({
        tag: "td",
        children: makeElement({
          tag: "h5",
          text: title,
        }),
      }),
      makeElement({
        tag: "td",
        children: makeElement({
          tag: "p",
          text: content,
        }),
      }),
    ],
  });
}

export class AuthViewConfigPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("AUTH_HOME");
  }

  async render(): Promise<void> {
    const tableElement = makeElement({
      tag: "table",
      class: "uk-table",
    });
    await this.router.setPageContent(tableElement);
    const contentElement = makeElement({ tag: "tbody" });
    tableElement.appendChild(contentElement);

    const authList = objectToMap(await listAuth()) as Map<string, AuthMethod>;
    const authMethod = authList.get(this.state.baseMount);

    contentElement.appendChild(
      HeaderAndContent(i18next.t("auth_view_config_type"), authMethod.type),
    );
    contentElement.appendChild(
      HeaderAndContent(i18next.t("auth_view_config_path"), this.state.baseMount),
    );
    contentElement.appendChild(
      HeaderAndContent(i18next.t("auth_view_config_description"), authMethod.description),
    );
    contentElement.appendChild(
      HeaderAndContent(i18next.t("auth_view_config_accessor"), authMethod.accessor),
    );
    contentElement.appendChild(
      HeaderAndContent(i18next.t("auth_view_config_local"), String(authMethod.local).toString()),
    );
    contentElement.appendChild(
      HeaderAndContent(
        i18next.t("auth_view_config_seal_wrap"),
        String(authMethod.seal_wrap).toString(),
      ),
    );
    contentElement.appendChild(
      HeaderAndContent(
        i18next.t("auth_view_config_list_when_unauth"),
        String(authMethod.config.listing_visibility).toString(),
      ),
    );
    contentElement.appendChild(
      HeaderAndContent(
        i18next.t("auth_view_config_default_lease_ttl"),
        String(authMethod.config.default_lease_ttl).toString(),
      ),
    );
    contentElement.appendChild(
      HeaderAndContent(
        i18next.t("auth_view_config_max_lease_ttl"),
        String(authMethod.config.max_lease_ttl).toString(),
      ),
    );
    contentElement.appendChild(
      HeaderAndContent(
        i18next.t("auth_view_config_token_type"),
        authMethod.config.token_type as string,
      ),
    );
  }

  get name(): string {
    return i18next.t("auth_view_config_title");
  }
}
