import { Page } from "../../../../types/Page";
import { listUserPassUsers } from "../../../../api/auth/userpass/listUserPassUsers";
import { render } from "preact";
import i18next from "i18next";

export class UserPassUsersListPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("AUTH_HOME");
  }

  async render(): Promise<void> {
    const users = await listUserPassUsers(this.state.authPath);

    render(
      <div>
        <button
          class="uk-button uk-margin uk-button-primary"
          type="submit"
          onClick={async () => {
            await this.router.changePage("USERPASS_USER_NEW");
          }}
        >
          {i18next.t("userpass_user_list_new_btn")}
        </button>

        <ul>
          {...users.map((user) => (
            <li>
              <a
                onClick={async () => {
                  this.state.userPassUser = user;
                  await this.router.changePage("USERPASS_USER_VIEW");
                }}
              >
                {user}
              </a>
            </li>
          ))}
        </ul>
      </div>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("userpass_users_list_title");
  }
}
