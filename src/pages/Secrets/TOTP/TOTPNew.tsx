import { Component, JSX, createRef, render } from "preact";
import { Form } from "../../../elements/Form";
import { Margin } from "../../../elements/Margin";
import { MarginInline } from "../../../elements/MarginInline";
import { Page } from "../../../types/Page";
import { QRScanner } from "../../../elements/QRScanner";
import { SecretTitleElement } from "../SecretTitleElement";
import { addNewTOTP } from "../../../api/totp/addNewTOTP";
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

export class TOTPNewForm extends Component<{ page: Page }, { qrMode: boolean }> {
  constructor() {
    super();
    this.state = {
      qrMode: false,
    };
  }

  uriInputRef = createRef<HTMLInputElement>();

  async onSubmit(data: FormData): Promise<void> {
    const page = this.props.page;
    const parms = {
      url: data.get("uri") as string,
      key: removeDashSpaces(data.get("key") as string).toUpperCase(),
      name: data.get("name") as string,
      generate: false,
    };

    try {
      await addNewTOTP(page.state.baseMount, parms);
      await page.router.changePage("TOTP_VIEW");
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(`API Error: ${error.message}`);
    }
  }

  render(): JSX.Element {
    return (
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

        <p hidden={this.state.qrMode}>{i18next.t("totp_new_info")}</p>

        <Margin>
          <input
            class="uk-input uk-form-width-medium"
            name="key"
            type="text"
            hidden={this.state.qrMode}
            placeholder={i18next.t("totp_new_key_input")}
          />
        </Margin>

        <Margin>
          <input
            class="uk-input uk-form-width-medium"
            ref={this.uriInputRef}
            name="uri"
            type="text"
            hidden={this.state.qrMode}
            placeholder={i18next.t("totp_new_uri_input")}
          />
        </Margin>

        {this.state.qrMode && (
          <QRScanner
            onScan={(uri) => {
              this.uriInputRef.current.value = uri;
              this.setState({ qrMode: !this.state.qrMode });
            }}
          />
        )}

        <MarginInline>
          <button
            class="uk-button uk-button-primary"
            type="button"
            onClick={() => {
              this.setState({ qrMode: !this.state.qrMode });
            }}
          >
            {!this.state.qrMode
              ? i18next.t("totp_new_switch_to_qr_btn")
              : i18next.t("totp_new_switch_back_to_manual_input_btn")}
          </button>
        </MarginInline>

        <p id="errorText" class="uk-text-danger" />

        <MarginInline>
          <button class="uk-button uk-button-primary" type="submit">
            {i18next.t("totp_new_add_btn")}
          </button>
        </MarginInline>
      </Form>
    );
  }
}

export class TOTPNewPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("TOTP_VIEW");
  }
  async render(): Promise<void> {
    render(<TOTPNewForm page={this} />, this.router.pageContentElement);
  }

  async renderPageTitle(): Promise<void> {
    render(
      <SecretTitleElement router={this.router} suffix={i18next.t("totp_new_suffix")} />,
      this.router.pageTitleElement,
    );
  }

  get name(): string {
    return i18next.t("totp_new_title");
  }
}
