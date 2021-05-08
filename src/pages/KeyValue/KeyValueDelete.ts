import { Page } from "../../types/Page";
import { changePage, setPageContent, setTitleElement } from "../../pageUtils";
import { deleteSecret } from "../../api/deleteSecret";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import i18next from 'i18next';

export class KeyValueDeletePage extends Page {
  constructor() {
    super();
  }
  goBack(): void {
    if (pageState.currentSecretVersion != null) {
      pageState.currentSecretVersion = null;
      changePage("KEY_VALUE_SECRET");
    } else {
      pageState.currentSecret = "";
      changePage("KEY_VALUE_VIEW");
    }
  }
  render(): void {
    setTitleElement(pageState);
    setPageContent(makeElement({
      tag: "div",
      children: [
        makeElement({
          tag: "h5",
          text: i18next.t("kv_delete_text")
        }),
        makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-danger"],
          text: i18next.t("kv_delete_btn"),
          onclick: _ => {
            deleteSecret(
              pageState.currentBaseMount,
              pageState.currentMountType,
              pageState.currentSecretPath,
              pageState.currentSecret,
              pageState.currentSecretVersion,
            ).then(() => {
              this.goBack();
            });
          }
        }),
      ]
    }));
  }
  get titleSuffix(): string {
    return i18next.t("kv_delete_suffix");
  }
  get name(): string {
    return i18next.t("kv_delete_title");
  }
}