import { Form } from "../../elements/Form";
import { MarginInline } from "../../elements/MarginInline";
import { Page } from "../../types/Page";
import { deleteMount } from "../../api/sys/deleteMount";
import { render } from "preact";
import { setErrorText } from "../../pageUtils";
import i18next from "i18next";

export class DeleteSecretsEnginePage extends Page {
  constructor() {
    super();
  }

  async render(): Promise<void> {
    render(
      <Form
        onSubmit={async () => {
          await this.onSubmit();
        }}
      >
        <p>{i18next.t("delete_secrets_engine_message")}</p>

        <p class="uk-text-danger" id="errorText" />

        <MarginInline>
          <button class="uk-button uk-button-danger" type="submit">
            {i18next.t("delete_secrets_engine_delete_btn")}
          </button>
        </MarginInline>
      </Form>,
      this.router.pageContentElement,
    );
  }

  async onSubmit(): Promise<void> {
    try {
      await deleteMount(this.state.baseMount);
      await this.router.changePage("SECRETS_HOME");
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(error.message);
    }
  }

  get name(): string {
    return i18next.t("delete_secrets_engine_title", { mount: this.state.baseMount });
  }
}
