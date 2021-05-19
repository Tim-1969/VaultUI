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
    const authMethod = authList.get(this.state.currentBaseMount);

    contentElement.appendChild(HeaderAndContent("Type", authMethod.type));
    contentElement.appendChild(HeaderAndContent("Path", this.state.currentBaseMount));
    contentElement.appendChild(HeaderAndContent("Description", authMethod.description));
    contentElement.appendChild(HeaderAndContent("Accessor", authMethod.accessor));
    contentElement.appendChild(HeaderAndContent("Local", String(authMethod.local).toString()));
    contentElement.appendChild(
      HeaderAndContent("Seal Wrap", String(authMethod.seal_wrap).toString()),
    );
    contentElement.appendChild(
      HeaderAndContent(
        "List when unauthenticated?",
        String(authMethod.config.listing_visibility).toString(),
      ),
    );
    contentElement.appendChild(
      HeaderAndContent("Default Lease TTL", String(authMethod.config.default_lease_ttl).toString()),
    );
    contentElement.appendChild(
      HeaderAndContent("Max Lease TTL", String(authMethod.config.max_lease_ttl).toString()),
    );
    contentElement.appendChild(
      HeaderAndContent("Token Type", authMethod.config.token_type as string),
    );
  }

  get name(): string {
    return i18next.t("auth_view_config_title");
  }
}
