import { Page } from "../../types/Page";
import { changePage, setPageContent, setTitleElement } from "../../pageUtils";
import { deleteSecret } from "../../api/kv/deleteSecret";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import i18next from "i18next";

export class KeyValueDeletePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    if (pageState.currentSecretVersion != null) {
      pageState.currentSecretVersion = null;
      await changePage("KEY_VALUE_SECRET");
    } else {
      pageState.currentSecret = "";
      await changePage("KEY_VALUE_VIEW");
    }
  }
  async render(): Promise<void> {
    setTitleElement(pageState);
    setPageContent(
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
                pageState.currentBaseMount,
                pageState.currentMountType,
                pageState.currentSecretPath,
                pageState.currentSecret,
                pageState.currentSecretVersion,
              ).then(() => {
                void this.goBack();
              });
            },
          }),
        ],
      }),
    );
  }
  get titleSuffix(): string {
    return i18next.t("kv_delete_suffix");
  }
  get name(): string {
    return i18next.t("kv_delete_title");
  }
}
