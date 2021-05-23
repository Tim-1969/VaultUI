import { Form } from "../../../elements/ReactForm";
import { Margin } from "../../../elements/ReactMargin";
import { MarginInline } from "../../../elements/ReactMarginInline";
import { Page } from "../../../types/Page";
import { newMount } from "../../../api/sys/newMount";
import { render } from "preact";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

export class NewKVEnginePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("SECRETS_HOME");
  }
  async render(): Promise<void> {
    render(
      <Form onSubmit={(data) => this.submit(data)}>
        <Margin>
          <input
            class="uk-input uk-form-width-medium"
            name="name"
            type="text"
            placeholder={i18next.t("new_kv_engine_name_input")}
            required
          />
        </Margin>
        <Margin>
          <select class="uk-input uk-form-width-medium" name="version">
            <option label={i18next.t("new_kv_engine_version_2")} value="2">
              {i18next.t("new_kv_engine_version_2")}
            </option>
            <option label={i18next.t("new_kv_engine_version_1")} value="1">
              {i18next.t("new_kv_engine_version_1")}
            </option>
          </select>
        </Margin>
        <p class="uk-text-danger" id="errorText" />
        <MarginInline>
          <button class="uk-button uk-button-primary" type="submit">
            {i18next.t("new_kv_engine_create_btn")}
          </button>
        </MarginInline>
      </Form>,
      this.router.pageContentElement,
    );
  }

  async submit(data: FormData): Promise<void> {
    const name = data.get("name") as string;
    const version = data.get("version") as string;

    try {
      await newMount({
        name: name,
        type: "kv",
        options: {
          version: version,
        },
      });
      this.state.secretMountType = "kv-v" + version;
      this.state.baseMount = name + "/";
      await this.router.changePage("KEY_VALUE_VIEW");
    } catch (e) {
      const error = e as Error;
      setErrorText(error.message);
    }
  }

  get name(): string {
    return i18next.t("new_kv_engine_title");
  }
}
