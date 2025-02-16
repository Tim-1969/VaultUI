import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { deleteTOTP } from "../../../api/totp/deleteTOTP";
import { render } from "preact";
import i18next from "i18next";

export class TOTPDeletePage extends Page {
  constructor() {
    super();
  }

  async cleanup(): Promise<void> {
    this.state.secretItem = "";
  }

  async goBack(): Promise<void> {
    this.state.secretItem = "";
    await this.router.changePage("TOTP_VIEW");
  }
  async render(): Promise<void> {
    render(
      <div>
        <h5>{i18next.t("totp_delete_text")}</h5>
        <button
          class="uk-button uk-button-danger"
          onClick={async () => {
            await deleteTOTP(this.state.baseMount, this.state.secretItem);
            await this.goBack();
          }}
        >
          {i18next.t("kv_delete_btn")}
        </button>
      </div>,
      this.router.pageContentElement,
    );
  }

  async renderPageTitle(): Promise<void> {
    render(
      <SecretTitleElement page={this} suffix={i18next.t("totp_delete_suffix")} />,
      this.router.pageTitleElement,
    );
  }

  get name(): string {
    return i18next.t("totp_delete_title");
  }
}
