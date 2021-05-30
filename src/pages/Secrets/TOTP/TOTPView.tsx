import { Component, JSX, render } from "preact";
import { CopyableInputBox } from "../../../elements/CopyableInputBox";
import { DoesNotExistError } from "../../../types/internalErrors";
import { Grid, GridSizes } from "../../../elements/Grid";
import { MarginInline } from "../../../elements/MarginInline";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getCapsPath } from "../../../api/sys/getCapabilities";
import { getTOTPCode } from "../../../api/totp/getTOTPCode";
import { getTOTPKeys } from "../../../api/totp/getTOTPKeys";
import { removeDoubleSlash } from "../../../utils";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

export class RefreshingTOTPGridItem extends Component<
  { baseMount: string; totpKey: string; page: Page; canDelete: boolean },
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

  componentWillUnmount(): void {
    clearInterval(this.timer as number);
  }

  componentDidMount(): void {
    this.updateTOTPCode();
    this.timer = setInterval(() => {
      this.updateTOTPCode();
    }, 3000);
  }

  render(): JSX.Element {
    return (
      <Grid size={GridSizes.NORMAL}>
        <CopyableInputBox text={this.props.totpKey} copyable />
        <CopyableInputBox text={this.state.totpValue} copyable />
        <div>
          <MarginInline>
            {this.props.canDelete && (
              <button
                class="uk-button uk-button-danger"
                onClick={async () => {
                  const page = this.props.page;
                  page.state.secretItem = this.props.totpKey;
                  await page.router.changePage("TOTP_DELETE");
                }}
              >
                {i18next.t("totp_view_secret_delete_btn")}
              </button>
            )}
          </MarginInline>
        </div>
      </Grid>
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

    const caps = await getCapsPath("/sys/mounts/" + this.state.baseMount);

    render(
      <div>
        <p>
          {caps.includes("create") && (
            <button
              class="uk-button uk-button-primary"
              onClick={async () => {
                await this.router.changePage("TOTP_NEW");
              }}
            >
              {i18next.t("totp_view_new_btn")}
            </button>
          )}
          {caps.includes("delete") && (
            <button
              class="uk-button uk-button-danger"
              onClick={async () => {
                await this.router.changePage("DELETE_SECRET_ENGINE");
              }}
            >
              {i18next.t("totp_view_delete_btn")}
            </button>
          )}
        </p>
        <br />
        <br />
        <div id="totpList">
          {
            await (async () => {
              try {
                const elem = await Promise.all(
                  Array.from(await getTOTPKeys(this.state.baseMount)).map(async (key) => {
                    const caps = await getCapsPath(
                      removeDoubleSlash(this.state.baseMount + "code/" + key),
                    );
                    if (caps.includes("read")) {
                      return (
                        <RefreshingTOTPGridItem
                          baseMount={this.state.baseMount}
                          totpKey={key}
                          page={this}
                          canDelete={caps.includes("delete")}
                        />
                      );
                    }
                  }),
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

  async renderPageTitle(): Promise<void> {
    render(<SecretTitleElement page={this} />, this.router.pageTitleElement);
  }

  get name(): string {
    return i18next.t("totp_view_title");
  }
}
