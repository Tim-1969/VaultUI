import { Page } from "../../types/Page.js";
import { deleteSecret } from "../../api.js";
import { setPageContent, setTitleElement } from "../../pageUtils.js";
import { makeElement } from "../../htmlUtils.js";

export class KeyValueDeletePage extends Page {
  constructor() {
    super();
  }
  goBack() {
    if (pageState.currentSecretVersion != "0") {
      pageState.currentSecretVersion = "0";
      changePage(pages.KEY_VALUE_SECRETS);
    } else {
      pageState.currentSecret = "";
      changePage(pages.KEY_VALUE_VIEW);
    }
  }
  render() {
    setTitleElement(pageState);
    setPageContent(makeElement({
      tag: "div",
      children: [
        makeElement({
          tag: "h5",
          text: "Are you sure you want to delete this?"
        }),
        makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-danger"],
          text: "Delete",
          onclick: _ => {
            deleteSecret(pageState.currentBaseMount, pageState.currentSecretPath, pageState.currentSecret, pageState.currentSecretVersion).then(() => {
              this.goBack();
            });
          }
        }),
      ]
    }));
  }

  get name() {
    return "K/V Delete";
  }
}