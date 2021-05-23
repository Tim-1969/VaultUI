import { HeaderAndContent } from "../../../../elements/ReactHeaderAndContent";
import { Page } from "../../../../types/Page";
import { getUserPassUser } from "../../../../api/auth/userpass/getUserPassUser";
import { render } from "preact";
import { toStr } from "../../../../utils";
import i18next from "i18next";

export class UserPassUserViewPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("USERPASS_USERS_LIST");
  }

  async render(): Promise<void> {
    const user = await getUserPassUser(this.state.authPath, this.state.userPassUser);

    render(
      <div>
        <p>
          <button
            class="uk-button uk-button-danger"
            onClick={async () => {
              await this.router.changePage("USERPASS_USER_DELETE");
            }}
          >
            {i18next.t("userpass_user_view_delete_btn")}
          </button>
          <button
            class="uk-button uk-button-primary"
            onClick={async () => {
              await this.router.changePage("USERPASS_USER_EDIT");
            }}
          >
            {i18next.t("userpass_user_view_edit_btn")}
          </button>
        </p>
        <table class="uk-table">
          <tbody>
            <HeaderAndContent
              title={i18next.t("userpass_common_cidrs")}
              content={user.token_bound_cidrs.join()}
            />
            <HeaderAndContent
              title={i18next.t("userpass_common_exp_max_ttl")}
              content={toStr(user.token_explicit_max_ttl)}
            />
            <HeaderAndContent
              title={i18next.t("userpass_common_max_ttl")}
              content={toStr(user.token_max_ttl)}
            />
            <HeaderAndContent
              title={i18next.t("userpass_common_default_policy_attached")}
              content={toStr(user.token_no_default_policy)}
            />
            <HeaderAndContent
              title={i18next.t("userpass_common_max_token_uses")}
              content={toStr(user.token_num_uses)}
            />
            <HeaderAndContent
              title={i18next.t("userpass_common_token_peroid")}
              content={toStr(user.token_period)}
            />
            <HeaderAndContent
              title={i18next.t("userpass_common_policies")}
              content={user.token_policies.join()}
            />
            <HeaderAndContent
              title={i18next.t("userpass_common_initial_ttl")}
              content={toStr(user.token_ttl)}
            />
            <HeaderAndContent
              title={i18next.t("userpass_common_type")}
              content={toStr(user.token_type)}
            />
          </tbody>
        </table>
      </div>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("userpass_user_view_title");
  }
}
1;
