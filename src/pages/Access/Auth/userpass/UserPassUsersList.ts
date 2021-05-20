import { Page } from "../../../../types/Page";
import { listUserPassUsers } from "../../../../api/auth/userpass/listUserPassUsers";
import { makeElement } from "z-makeelement";
import i18next from "i18next";

export class UserPassUsersListPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("AUTH_HOME");
  }

  async render(): Promise<void> {
    const pageContent = makeElement({ tag: "div" });
    await this.router.setPageContent(pageContent);

    const users = await listUserPassUsers(this.state.authPath);
    pageContent.appendChild(
      makeElement({
        tag: "ul",
        children: [
          ...users.map((user) => {
            return makeElement({
              tag: "li",
              children: makeElement({
                tag: "a",
                text: user,
                onclick: async () => {
                  this.state.userPassUser = user;
                  await this.router.changePage("USERPASS_USER_VIEW");
                },
              }),
            });
          }),
        ],
      }),
    );
  }

  get name(): string {
    return i18next.t("userpass_users_list_title");
  }
}
