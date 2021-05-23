import { Form } from "../../../elements/ReactForm";
import { Margin } from "../../../elements/ReactMargin";
import { MarginInline } from "../../../elements/ReactMarginInline";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { addNewTOTP } from "../../../api/totp/addNewTOTP";
import { render } from "preact";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

function replaceAll(str: string, replace: string, replaceWith: string): string {
  return str.replace(new RegExp(replace, "g"), replaceWith);
}
function removeDashSpaces(str: string): string {
  str = replaceAll(str, "-", "");
  str = replaceAll(str, " ", "");
  return str;
}

export class TOTPNewPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("TOTP_VIEW");
  }
  async render(): Promise<void> {
    render(
      <Form onSubmit={(data) => this.onSubmit(data)}>
        <Margin>
          <input
            class="uk-input uk-form-width-medium"
            name="name"
            type="text"
            placeholder={i18next.t("totp_new_name_text")}
            required
          />
        </Margin>
        <p>{i18next.t("totp_new_info")}</p>
        <Margin>
          <input
            class="uk-input uk-form-width-medium"
            name="uri"
            type="text"
            placeholder={i18next.t("totp_new_uri_input")}
          />
        </Margin>
        <Margin>
          <input
            class="uk-input uk-form-width-medium"
            name="key"
            type="text"
            placeholder={i18next.t("totp_new_key_input")}
          />
        </Margin>
        <p id="errorText" class="uk-text-danger" />
        <MarginInline>
          <button class="uk-button uk-button-primary" type="submit">
            {i18next.t("totp_new_add_btn")}
          </button>
        </MarginInline>
      </Form>,
      this.router.pageContentElement,
    );
  }

  async onSubmit(data: FormData): Promise<void> {
    const parms = {
      url: data.get("uri") as string,
      key: removeDashSpaces(data.get("key") as string).toUpperCase(),
      name: data.get("name") as string,
      generate: false,
    };

    try {
      await addNewTOTP(this.state.baseMount, parms);
      await this.router.changePage("TOTP_VIEW");
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(`API Error: ${error.message}`);
    }
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router, i18next.t("totp_new_suffix"));
  }

  get name(): string {
    return i18next.t("totp_new_title");
  }
}
