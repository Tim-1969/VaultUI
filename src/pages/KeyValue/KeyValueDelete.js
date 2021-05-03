import { Page } from "../../types/Page.js";
import { changePage, setPageContent, setTitleElement } from "../../pageUtils.js";
import { deleteSecret } from "../../api.js";
import { makeElement } from "../../htmlUtils.js";
import i18next from 'i18next';

export class KeyValueDeletePage extends Page {
  constructor() {
    super();
  }
  goBack() {
    if (pageState.currentSecretVersion != "0") {
      pageState.currentSecretVersion = "0";
      changePage("KEY_VALUE_SECRET");
    } else {
      pageState.currentSecret = "";
      changePage("KEY_VALUE_VIEW");
    }
  }
  render() {
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
            deleteSecret(pageState.currentBaseMount, pageState.currentSecretPath, pageState.currentSecret, pageState.currentSecretVersion).then(() => {
              this.goBack();
            });
          }
        }),
      ]
    }));
  }
  get titleSuffix() {
    return i18next.t("kv_delete_suffix");
  }
  get name() {
    return i18next.t("kv_delete_title");
  }
}