import { Page } from "../../types/Page";
import { SecretTitleElement } from "../../elements/SecretTitleElement";
import { deleteSecret } from "../../api/kv/deleteSecret";
import { makeElement } from "../../htmlUtils";
import i18next from "i18next";

export class KeyValueDeletePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    if (this.state.currentSecretVersion != null) {
      this.state.currentSecretVersion = null;
      await this.router.changePage("KEY_VALUE_SECRET");
    } else {
      this.state.currentSecret = "";
      await this.router.changePage("KEY_VALUE_VIEW");
    }
  }
  async render(): Promise<void> {
    await this.router.setPageContent(
      makeElement({
        tag: "div",
        children: [
          makeElement({
            tag: "h5",
            text: i18next.t("kv_delete_text"),
          }),
          makeElement({
            tag: "button",
            class: ["uk-button", "uk-button-danger"],
            text: i18next.t("kv_delete_btn"),
            onclick: () => {
              void deleteSecret(
                this.state.currentBaseMount,
                this.state.currentMountType,
                this.state.currentSecretPath,
                this.state.currentSecret,
                this.state.currentSecretVersion,
              ).then(() => {
                void this.goBack();
              });
            },
          }),
        ],
      }),
    );
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router, i18next.t("kv_delete_suffix"));
  }

  get name(): string {
    return i18next.t("kv_delete_title");
  }
}
