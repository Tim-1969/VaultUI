import { Page } from "../../../../types/Page";
import { deleteUserPassUser } from "../../../../api/auth/userpass/deleteUserPassUser";
import { render } from "preact";
import i18next from "i18next";

export class UserPassUserDeletePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("USERPASS_USERS_LIST");
  }
  async render(): Promise<void> {
    render(
      <>
        <h5>{i18next.t("userpass_user_delete_text")}</h5>
        <button
          class="uk-button uk-button-danger"
          onClick={async () => {
            await deleteUserPassUser(this.state.authPath, this.state.userPassUser);
            await this.goBack();
          }}
        >
          {i18next.t("userpass_user_delete_btn")}
        </button>
      </>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("userpass_user_delete_title");
  }
}
