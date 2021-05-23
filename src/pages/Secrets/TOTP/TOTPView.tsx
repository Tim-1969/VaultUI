import { Component, JSX, render } from "preact";
import { CopyableInputBox } from "../../../elements/ReactCopyableInputBox";
import { DoesNotExistError } from "../../../types/internalErrors";
import { MarginInline } from "../../../elements/ReactMarginInline";
import { Page } from "../../../types/Page";
import { PageRouter } from "z-pagerouter";
import { PageState } from "../../../PageState";
import { SecretTitleElement } from "../SecretTitleElement";
import { getTOTPCode } from "../../../api/totp/getTOTPCode";
import { getTOTPKeys } from "../../../api/totp/getTOTPKeys";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

export class RefreshingTOTPGridItem extends Component<
  { baseMount: string; totpKey: string; router: PageRouter },
  { totpValue: string }
> {
  constructor() {
    super();
    this.state = { totpValue: "" };
  }
  timer: unknown;

  updateTOTPCode(): void {
    void getTOTPCode(this.props.baseMount, this.props.totpKey).then((code) => {
      this.setState({ totpValue: code });
    });
  }

  componentDidMount(): void {
    this.updateTOTPCode();
    this.timer = setInterval(() => {
      this.updateTOTPCode();
    }, 3000);
  }

  render(): JSX.Element {
    return (
      <div class="uk-grid uk-grid-small uk-text-left" uk-grid>
        <CopyableInputBox text={this.props.totpKey} copyable />
        <CopyableInputBox text={this.state.totpValue} copyable />
        <div>
          <MarginInline>
            <button
              class="uk-button uk-button-danger"
              onClick={async () => {
                const state = this.props.router.state as PageState;
                state.secretItem = this.props.totpKey;
                await this.props.router.changePage("TOTP_DELETE");
              }}
            >
              {i18next.t("totp_view_delete_btn")}
            </button>
          </MarginInline>
        </div>
      </div>
    );
  }
}

export class TOTPViewPage extends Page {
  constructor() {
    super();
    this.refresher = undefined;
  }

  refresher: number;

  async goBack(): Promise<void> {
    await this.router.changePage("SECRETS_HOME");
  }

  async render(): Promise<void> {
    this.state.secretItem = "";
    render(
      <div>
        <button
          class="uk-button uk-button-primary uk-margin-bottom"
          onClick={async () => {
            await this.router.changePage("TOTP_NEW");
          }}
        >
          {i18next.t("totp_view_new_btn")}
        </button>
        <br />
        <br />
        <div id="totpList">
          {
            await (async () => {
              try {
                const elem = await Promise.all(
                  Array.from(await getTOTPKeys(this.state.baseMount)).map(async (key) => (
                    <RefreshingTOTPGridItem
                      baseMount={this.state.baseMount}
                      totpKey={key}
                      router={this.router}
                    />
                  )),
                );
                return elem;
              } catch (e: unknown) {
                const error = e as Error;
                if (error == DoesNotExistError) {
                  return <p>{i18next.t("totp_view_empty")}</p>;
                } else {
                  setErrorText(error.message);
                }
              }
            })()
          }
        </div>
      </div>,
      this.router.pageContentElement,
    );
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router);
  }

  get name(): string {
    return i18next.t("totp_view_title");
  }
}
