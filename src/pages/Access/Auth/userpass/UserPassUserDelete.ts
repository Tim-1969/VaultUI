import { Page } from "../../../../types/Page";
import { deleteUserPassUser } from "../../../../api/auth/userpass/deleteUserPassUser";
import { makeElement } from "z-makeelement";
import i18next from "i18next";

export class UserPassUserDeletePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("USERPASS_USERS_LIST");
  }
  async render(): Promise<void> {
    await this.router.setPageContent(
      makeElement({
        tag: "div",
        children: [
          makeElement({
            tag: "h5",
            text: i18next.t("userpass_user_delete_text"),
          }),
          makeElement({
            tag: "button",
            class: ["uk-button", "uk-button-danger"],
            text: i18next.t("userpass_user_delete_btn"),
            onclick: async () => {
              await deleteUserPassUser(this.state.authPath, this.state.userPassUser);
              await this.goBack();
            },
          }),
        ],
      }),
    );
  }

  get name(): string {
    return i18next.t("userpass_user_delete_title");
  }
}
