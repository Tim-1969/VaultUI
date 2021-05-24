import { Form } from "../../../elements/Form";
import { Margin } from "../../../elements/Margin";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { createOrUpdateSecret } from "../../../api/kv/createOrUpdateSecret";
import { render } from "preact";
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
    render(
      <div>
        <Form onSubmit={async (formData) => await this.newKVSecretHandleForm(formData)}>
          <Margin>
            <input
              class="uk-input uk-form-width-medium"
              name="path"
              placeholder={i18next.t("kv_new_path")}
              required
            />
          </Margin>
          <p class="uk-text-danger" id="errorText" />
          <button class="uk-button uk-button-primary" type="submit">
            {i18next.t("kv_new_create_btn")}
          </button>
        </Form>
      </div>,
      this.router.pageContentElement,
    );
  }

  async newKVSecretHandleForm(formData: FormData): Promise<void> {
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

  async renderPageTitle(): Promise<void> {
    render(
      <SecretTitleElement router={this.router} suffix={i18next.t("kv_new_suffix")} />,
      this.router.pageTitleElement,
    );
  }

  get name(): string {
    return i18next.t("kv_new_title");
  }
}
