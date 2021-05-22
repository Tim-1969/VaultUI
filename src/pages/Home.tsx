import { Page } from "../types/Page";
import { Tile } from "../elements/ReactTile";
import { TokenInfo } from "../api/types/token";
import { lookupSelf } from "../api/sys/lookupSelf";
import { prePageChecks, setErrorText } from "../pageUtils";
import { render } from "preact";
import i18next from "i18next";

export class HomePage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    await this.router.setPageContent("");
    if (!(await prePageChecks(this.router))) return;

    this.state.baseMount = "";
    this.state.secretPath = [];
    this.state.secretItem = "";
    this.state.secretVersion = null;

    let selfTokenInfo: TokenInfo;
    try {
      selfTokenInfo = await lookupSelf();
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(error.message);
      if (error.message == "permission denied") {
        this.state.token = "";
        await this.router.changePage("LOGIN");
      }
    }

    render(
      <div>
        <ul id="textList" class="uk-nav">
          <li>
            <span>{i18next.t("home_vaulturl_text", { text: this.state.apiURL })}</span>
          </li>
          <li>
            <a
              onClick={async () => {
                await this.router.changePage("PW_GEN");
              }}
            >
              {i18next.t("home_password_generator_btn")}
            </a>
          </li>
          <li>
            <span>
              {i18next.t("home_your_token_expires_in", {
                date: new Date(selfTokenInfo.expire_time),
              })}
            </span>
          </li>
        </ul>
        <div
          class="uk-child-width-1-1@s uk-child-width-1-2@m uk-grid-small uk-grid-match uk-margin-top"
          uk-grid
        >
          <Tile
            title={i18next.t("home_secrets_title")}
            description={i18next.t("home_secrets_description")}
            icon="file-edit"
            onclick={async () => {
              await this.router.changePage("SECRETS_HOME");
            }}
          />
          <Tile
            title={i18next.t("home_access_title")}
            description={i18next.t("home_access_description")}
            icon="users"
            onclick={async () => {
              await this.router.changePage("ACCESS_HOME");
            }}
          />
        </div>
      </div>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("home_page_title");
  }
}
