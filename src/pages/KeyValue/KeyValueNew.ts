import { Page } from "../../types/Page";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { createOrUpdateSecret } from "../../api/kv/createOrUpdateSecret";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import i18next from 'i18next';

export class KeyValueNewPage extends Page {
  constructor() {
    super();
  }

  goBack(): void {
    changePage("KEY_VALUE_VIEW");
  }

  addKVNewForm: HTMLFormElement;

  render(): void {
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
    }) as HTMLFormElement;
    setPageContent(this.addKVNewForm);

    this.addKVNewForm.addEventListener("submit", function (e) {
      e.preventDefault();
      this.newKVSecretHandleForm();
    }.bind(this));
  }

  newKVSecretHandleForm(): void {
    const formData = new FormData(this.addKVNewForm);
    const path = formData.get("path") as string;
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

  get titleSuffix(): string {
    return i18next.t("kv_new_suffix");
  }

  get name(): string {
    return i18next.t("kv_new_title");
  }
}