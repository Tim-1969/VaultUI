import { Form } from "../../../elements/ReactForm";
import { Margin } from "../../../elements/ReactMargin";
import { MarginInline } from "../../../elements/ReactMarginInline";
import { Page } from "../../../types/Page";
import { newMount } from "../../../api/sys/newMount";
import { render } from "preact";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

export class NewTransitEnginePage extends Page {
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
            placeholder={i18next.t("new_transit_engine_name_input")}
            required
          />
        </Margin>
        <p class="uk-text-danger" id="errorText" />
        <MarginInline>
          <button class="uk-button uk-button-primary" type="submit">
            {i18next.t("new_transit_engine_create_btn")}
          </button>
        </MarginInline>
      </Form>,
      this.router.pageContentElement,
    );
  }

  async submit(data: FormData): Promise<void> {
    const name = data.get("name") as string;

    try {
      await newMount({
        name: name,
        type: "transit",
      });
      this.state.secretMountType = "transit";
      this.state.baseMount = name + "/";
      await this.router.changePage("TRANSIT_VIEW");
    } catch (e) {
      const error = e as Error;
      setErrorText(error.message);
    }
  }

  get name(): string {
    return i18next.t("new_transit_engine_title");
  }
}
