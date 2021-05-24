import { Form } from "../../../elements/ReactForm";
import { Margin } from "../../../elements/ReactMargin";
import { MarginInline } from "../../../elements/ReactMarginInline";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { newTransitKey } from "../../../api/transit/newTransitKey";
import { render } from "preact";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

export class NewTransitKeyPage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    render(
      <Form
        onSubmit={async (data) => {
          await this.onSubmit(data);
        }}
      >
        <Margin>
          <input
            class="uk-input uk-form-width-medium"
            name="name"
            placeholder={i18next.t("transit_new_key_name_input")}
            type="text"
            required
          />
        </Margin>
        <Margin>
          <select class="uk-select uk-form-width-medium" name="type">
            {[
              "aes128-gcm96",
              "aes256-gcm96",
              "chacha20-poly1305",
              "ed25519",
              "ecdsa-p256",
              "ecdsa-p384",
              "ecdsa-p521",
              "rsa-2048",
              "rsa-3072",
              "rsa-4096",
            ].map((type) => (
              <option label={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Margin>
        <p class="uk-text-danger" id="errorText" />
        <MarginInline>
          <button class="uk-button uk-button-primary" type="submit">
            {i18next.t("transit_new_key_create_btn")}
          </button>
        </MarginInline>
      </Form>,
      this.router.pageContentElement,
    );
  }

  async onSubmit(data: FormData): Promise<void> {
    const name = data.get("name") as string;
    const type = data.get("type") as string;

    try {
      await newTransitKey(this.state.baseMount, {
        name: name,
        type: type,
      });
      this.state.secretItem = name;
      await this.router.changePage("TRANSIT_VIEW_SECRET");
    } catch (e) {
      const error = e as Error;
      setErrorText(error.message);
    }
  }

  async renderPageTitle(): Promise<void> {
    render(
      <SecretTitleElement router={this.router} suffix={i18next.t("transit_new_key_suffix")} />,
      this.router.pageTitleElement,
    );
  }

  get name(): string {
    return i18next.t("transit_new_key_title");
  }
}
