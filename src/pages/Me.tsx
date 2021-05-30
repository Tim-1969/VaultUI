import { Component, JSX, createRef, render } from "preact";
import { Page } from "../types/Page";
import { addClipboardNotifications, prePageChecks, setErrorText } from "../pageUtils";
import { getCapsPath } from "../api/sys/getCapabilities";
import { renewSelf } from "../api/sys/renewSelf";
import { sealVault } from "../api/sys/sealVault";
import ClipboardJS from "clipboard";
import i18next from "i18next";

export class CopyLink extends Component<{ text: string; data: string }, unknown> {
  linkRef = createRef();

  componentDidMount(): void {
    const clipboard = new ClipboardJS(this.linkRef.current);
    addClipboardNotifications(clipboard, 600);
  }

  render(): JSX.Element {
    return (
      <a ref={this.linkRef} data-clipboard-text={this.props.data}>
        {this.props.text}
      </a>
    );
  }
}

export class MePage extends Page {
  constructor() {
    super();
  }

  async render(): Promise<void> {
    if (!(await prePageChecks(this.router))) return;

    let canSealVault = false;
    try {
      const caps = await getCapsPath("sys/seal");
      canSealVault = caps.includes("sudo") && caps.includes("update");
    } catch (e) {
      canSealVault = false;
    }

    render(
      <ul class="uk-nav">
        <li>
          <a
            onClick={async () => {
              this.state.token = "";
              await this.router.changePage("HOME");
            }}
          >
            {i18next.t("me_log_out_btn")}
          </a>
        </li>
        <li>
          <CopyLink text={i18next.t("me_copy_token_btn")} data={this.state.token} />
        </li>
        <li>
          <a
            onClick={async () => {
              try {
                await renewSelf();
                await this.router.changePage("HOME");
              } catch (e: unknown) {
                const error = e as Error;
                setErrorText(error.message);
              }
            }}
          >
            {i18next.t("me_renew_lease_btn")}
          </a>
        </li>
        {canSealVault && (
          <li>
            <a
              onClick={async () => {
                await sealVault();
                await this.router.changePage("UNSEAL");
              }}
            >
              {i18next.t("me_seal_vault_btn")}
            </a>
          </li>
        )}
        <li>
          <a
            onClick={async () => {
              await this.router.changePage("SET_LANGUAGE");
            }}
          >
            {i18next.t("me_change_language_btn")}
          </a>
        </li>
      </ul>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("me_page_title");
  }
}
