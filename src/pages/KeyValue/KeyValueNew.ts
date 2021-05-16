import { Page } from "../../types/Page";
import { SecretTitleElement } from "../../elements/SecretTitleElement";
import { createOrUpdateSecret } from "../../api/kv/createOrUpdateSecret";
import { makeElement } from "z-makeelement";
import { setErrorText } from "../../pageUtils";
import i18next from "i18next";

export class KeyValueNewPage extends Page {
  constructor() {
    super();
  }

  async goBack(): Promise<void> {
    await this.router.changePage("KEY_VALUE_VIEW");
  }

  addKVNewForm: HTMLFormElement;

  async render(): Promise<void> {
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
              required: "true",
              type: "text",
              placeholder: i18next.t("kv_new_path"),
              name: "path",
            },
          }),
        }),
        makeElement({
          tag: "p",
          id: "errorText",
          class: "uk-text-danger",
        }),
        makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: i18next.t("kv_new_create_btn"),
          attributes: {
            type: "submit",
          },
        }),
      ],
    }) as HTMLFormElement;
    await this.router.setPageContent(this.addKVNewForm);

    this.addKVNewForm.addEventListener("submit", async (e: Event) => {
      e.preventDefault();
      await this.newKVSecretHandleForm();
    });
  }

  async newKVSecretHandleForm(): Promise<void> {
    const formData = new FormData(this.addKVNewForm);
    const path = formData.get("path") as string;
    let keyData = {};

    if (["kv-v1", "cubbyhole"].includes(this.state.currentMountType)) {
      keyData = { key: "value" };
    }

    try {
      await createOrUpdateSecret(
        this.state.currentBaseMount,
        this.state.currentMountType,
        this.state.currentSecretPath,
        path,
        keyData,
      );
      await this.router.changePage("KEY_VALUE_VIEW");
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(error.message);
    }
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router, i18next.t("kv_new_suffix"));
  }

  get name(): string {
    return i18next.t("kv_new_title");
  }
}
