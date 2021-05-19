import { AuthMethod } from "../../../api/types/auth";
import { Page } from "../../../types/Page";
import { listAuth } from "../../../api/auth/listAuth";
import { makeElement } from "z-makeelement";
import { objectToMap } from "../../../utils";
import i18next from "i18next";

export function AuthListElement(page: Page, path: string, method: AuthMethod): HTMLElement {
  const isClickable = method.type != "token";

  return makeElement({
    tag: "div",
    class: ["uk-padding-small", "uk-background-secondary"],
    children: [
      makeElement({
        tag: isClickable ? "a" : "span",
        class: "uk-h4 uk-margin-bottom",
        text: path,
        onclick: async () => {
          page.state.currentBaseMount = path;
          if (method.type == "userpass") {
            await page.router.changePage("USERPASS_USERS_LIST");
          }
        },
      }),
      makeElement({
        tag: "span",
        class: "uk-text-muted",
        text: ` (${method.accessor})`,
      }),
      makeElement({
        tag: "div",
        class: "uk-margin-top",
        children: [
          makeElement({
            tag: "button",
            class: "uk-button uk-button-small uk-button-primary",
            text: i18next.t("auth_home_view_config"),
            onclick: async () => {
              page.state.currentBaseMount = path;
              await page.router.changePage("AUTH_VIEW_CONFIG");
            },
          }),
          makeElement({
            tag: "button",
            class: "uk-button uk-button-small uk-button-primary",
            text: i18next.t("auth_home_edit_config"),
          }),
        ],
      }),
    ],
  });
}

export class AuthHomePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("ACCESS_HOME");
  }
  async render(): Promise<void> {
    this.state.currentSecretPath = [];

    const authList = objectToMap(await listAuth()) as Map<string, AuthMethod>;
    const contentElement = makeElement({ tag: "div" });
    await this.router.setPageContent(contentElement);
    for (const [path, details] of authList) {
      contentElement.appendChild(AuthListElement(this, path, details));
    }
  }
  get name(): string {
    return i18next.t("auth_home_title");
  }
}
