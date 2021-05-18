import { Page } from "../../../types/Page";
import i18next from "i18next";
import { setErrorText } from "../../../pageUtils";
import { listAuth } from "../../../api/auth/listAuth";
import { objectToMap } from "../../../utils";
import { AuthMethod } from "../../../api/types/auth";
import { makeElement } from "z-makeelement";


export function AuthListElement(path: string, method: AuthMethod): HTMLElement {
  const isClickable = method.type != "token";

  return makeElement({
    tag: "div",
    class: ["uk-padding-small", "uk-background-secondary"],
    children: [
      makeElement({
        tag: isClickable ? "a" : "span",
        class: "uk-h4 uk-margin-bottom",
        text: path,
      }),
      makeElement({
        tag: "span",
        class: "uk-text-muted",
        text: ` (${method.accessor})`
      }),
      makeElement({
        tag: "div",
        class: "uk-margin-top",
        children: [
          makeElement({
            tag: "button",
            class: "uk-button uk-button-small uk-button-primary",
            text: "View Config",
          }),
          makeElement({
            tag: "button",
            class: "uk-button uk-button-small uk-button-primary",
            text: "Edit Config",
          }),
        ]
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
    let authList = objectToMap(await listAuth()) as Map<string, AuthMethod>;
    const contentElement = makeElement({ tag: "div" });
    this.router.setPageContent(contentElement);
    for (const [path, details] of authList) {
      contentElement.appendChild(AuthListElement(path, details))
    }
  }
  get name(): string {
    return i18next.t("auth_home_title");
  }
}
