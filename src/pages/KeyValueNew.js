import { Page } from "../types/Page.js";
import { createOrUpdateSecret } from "../api.js";
import { setPageContent, setTitleElement, setErrorText } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";

export class KeyValueNewPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage(pages.KEY_VALUE_VIEW);
  }
  render() {
    setTitleElement(pageState);
    this.addKVNewForm = makeElement({
      tag: "form",
      id: "addKVNewForm",
      children: [
        makeElement({
          tag: "div",
          class: "uk-margin",
          children: makeElement({
            tag: "input",
            class: ["uk-input", "uk-form-width-medium"],
            attributes: {
              required: true,
              type: "text",
              placeholder: "Relative Path",
              name: "path"
            }
          })
        }),
        makeElement({
          tag: "p",
          id: "errorText",
          class: "uk-text-danger"
        }),
        makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: "Create Empty Secret",
          attributes: {
            type: "submit",
          }
        })
      ]
    });
    setPageContent(this.addKVNewForm);

    this.addKVNewForm.addEventListener("submit", function (e) {
      e.preventDefault();
      pageState.currentPage.newKVSecretHandleForm();
    });
  }

  newKVSecretHandleForm() {
    let formData = new FormData(this.addKVNewForm);
    let path = formData.get("path");
    let splitPath = path.split("/");
    let keyData = {};

    if (["kv-v1", "cubbyhole"].includes(pageState.currentMountType)) {
      keyData = { "key": "value" };
    }

    createOrUpdateSecret(
      pageState.currentBaseMount,
      pageState.currentSecretPath,
      splitPath[splitPath.length - 1],
      keyData
    ).then(_ => {
      changePage(pages.KEY_VALUE_VIEW);
      return;
    }).catch(e => {
      setErrorText(e.message);
    });
  }


  get name() {
    return "K/V New";
  }
}