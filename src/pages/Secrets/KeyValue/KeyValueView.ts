import { DoesNotExistError } from "../../../types/internalErrors";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getSecrets } from "../../../api/kv/getSecrets";
import { makeElement } from "z-makeelement";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

export class KeyValueViewPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    if (this.state.secretPath.length != 0) {
      this.state.popSecretPath();
      await this.router.changePage("KEY_VALUE_VIEW");
    } else {
      await this.router.changePage("SECRETS_HOME");
    }
  }
  async render(): Promise<void> {
    this.state.secretItem = "";

    const kvViewPageContent = makeElement({ tag: "div" });
    await this.router.setPageContent(kvViewPageContent);

    if (this.state.secretMountType == "cubbyhole") {
      kvViewPageContent.appendChild(
        makeElement({
          tag: "p",
          text: i18next.t("kv_view_cubbyhole_text"),
        }),
      );
    }

    const newButton = makeElement({
      tag: "button",
      text: i18next.t("kv_view_new_btn"),
      class: ["uk-button", "uk-button-primary", "uk-margin-bottom"],
      onclick: async () => {
        await this.router.changePage("KEY_VALUE_NEW_SECRET");
      },
    });
    kvViewPageContent.appendChild(newButton);

    try {
      const res = await getSecrets(
        this.state.baseMount,
        this.state.secretMountType,
        this.state.secretPath,
      );

      kvViewPageContent.appendChild(
        makeElement({
          tag: "ul",
          class: ["uk-nav", "uk-nav-default"],
          children: [
            ...res.map((secret) => {
              return makeElement({
                tag: "li",
                children: makeElement({
                  tag: "a",
                  text: secret,
                  onclick: async () => {
                    if (secret.endsWith("/")) {
                      this.state.pushSecretPath(secret);
                      await this.router.changePage("KEY_VALUE_VIEW");
                    } else {
                      this.state.secretItem = secret;
                      await this.router.changePage("KEY_VALUE_SECRET");
                    }
                  },
                }),
              });
            }),
          ],
        }),
      );
    } catch (e: unknown) {
      const error = e as Error;
      if (error == DoesNotExistError) {
        // getSecrets also 404's on no keys so dont go all the way back.
        if (this.state.secretPath.length != 0) {
          return this.goBack();
        } else {
          kvViewPageContent.appendChild(
            makeElement({
              tag: "p",
              text: i18next.t("kv_view_none_here_text"),
            }),
          );
        }
      } else {
        setErrorText(error.message);
      }
    }
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router);
  }

  get name(): string {
    return i18next.t("kv_view_title");
  }
}
