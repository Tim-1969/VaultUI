import { Form } from "../../../elements/Form";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { createOrUpdateSecret } from "../../../api/kv/createOrUpdateSecret";
import { makeElement } from "z-makeelement";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

export class KeyValueNewPage extends Page {
  constructor() {
    super();
  }

  async goBack(): Promise<void> {
    await this.router.changePage("KEY_VALUE_VIEW");
  }

  async render(): Promise<void> {
    await this.router.setPageContent(
      Form(
        [
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
        async (form: HTMLFormElement) => await this.newKVSecretHandleForm(form),
      ),
    );
  }

  async newKVSecretHandleForm(form: HTMLFormElement): Promise<void> {
    const formData = new FormData(form);
    const path = formData.get("path") as string;
    let keyData = {};

    if (["kv-v1", "cubbyhole"].includes(this.state.secretMountType)) {
      keyData = { key: "value" };
    }

    try {
      await createOrUpdateSecret(
        this.state.baseMount,
        this.state.secretMountType,
        this.state.secretPath,
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
