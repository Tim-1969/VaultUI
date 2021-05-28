import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { deleteSecret } from "../../../api/kv/deleteSecret";
import { render } from "preact";
import i18next from "i18next";

export class KeyValueDeletePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    if (this.state.secretVersion != null) {
      this.state.secretVersion = null;
      await this.router.changePage("KEY_VALUE_SECRET");
    } else {
      this.state.secretItem = "";
      await this.router.changePage("KEY_VALUE_VIEW");
    }
  }
  async render(): Promise<void> {
    render(
      <div>
        <h5>{i18next.t("kv_delete_text")}</h5>
        <button
          class="uk-button uk-button-danger"
          onClick={async () => {
            await deleteSecret(
              this.state.baseMount,
              this.state.secretMountType,
              this.state.secretPath,
              this.state.secretItem,
              this.state.secretVersion,
            );
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
      <SecretTitleElement page={this} suffix={i18next.t("kv_delete_suffix")} />,
      this.router.pageTitleElement,
    );
  }

  get name(): string {
    return i18next.t("kv_delete_title");
  }
}
