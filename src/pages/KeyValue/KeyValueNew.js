import { Page } from "../../types/Page.js";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils.js";
import { createOrUpdateSecret } from "../../api.js";
import { makeElement } from "../../htmlUtils.js";
import { pageState } from "../../globalPageState.js";
import i18next from 'i18next';

export class KeyValueNewPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage("KEY_VALUE_VIEW");
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
              placeholder: i18next.t("kv_new_path"),
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
          text: i18next.t("kv_new_create_btn"),
          attributes: {
            type: "submit",
          }
        })
      ]
    });
    setPageContent(this.addKVNewForm);

    this.addKVNewForm.addEventListener("submit", function (e) {
      e.preventDefault();
      this.newKVSecretHandleForm();
    }.bind(this));
  }

  newKVSecretHandleForm() {
    let formData = new FormData(this.addKVNewForm);
    let path = formData.get("path");
    let keyData = {};

    if (["kv-v1", "cubbyhole"].includes(pageState.currentMountType)) {
      keyData = { "key": "value" };
    }

    createOrUpdateSecret(
      pageState.currentBaseMount,
      pageState.currentMountType,
      pageState.currentSecretPath,
      path,
      keyData
    ).then(_ => {
      changePage("KEY_VALUE_VIEW");
      return;
    }).catch(e => {
      setErrorText(e.message);
    });
  }

  get titleSuffix() {
    return i18next.t("kv_new_suffix");
  }

  get name() {
    return i18next.t("kv_new_title");
  }
}