import { HeaderAndContent } from "../../../../elements/HeaderAndContent";
import { Page } from "../../../../types/Page";
import { getUserPassUser } from "../../../../api/auth/userpass/getUserPassUser";
import { makeElement } from "z-makeelement";
import i18next from "i18next";

export class UserPassUserViewPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("USERPASS_USERS_LIST");
  }

  async render(): Promise<void> {
    const tableElement = makeElement({
      tag: "table",
      class: "uk-table",
    });
    await this.router.setPageContent(tableElement);
    const contentElement = makeElement({ tag: "tbody" });
    tableElement.appendChild(contentElement);
    const user = await getUserPassUser(this.state.authPath, this.state.userPassUser);

    contentElement.appendChild(
      HeaderAndContent(i18next.t("userpass_user_view_cidrs"), user.token_bound_cidrs.join()),
    );
    contentElement.appendChild(
      HeaderAndContent(
        i18next.t("userpass_user_view_exp_max_ttl"),
        String(user.token_explicit_max_ttl).toString(),
      ),
    );
    contentElement.appendChild(
      HeaderAndContent(
        i18next.t("userpass_user_view_max_ttl"),
        String(user.token_max_ttl).toString(),
      ),
    );
    contentElement.appendChild(
      HeaderAndContent(
        i18next.t("userpass_user_view_default_policy_attached"),
        String(user.token_no_default_policy).toString(),
      ),
    );
    contentElement.appendChild(
      HeaderAndContent(
        i18next.t("userpass_user_view_max_token_uses"),
        String(user.token_num_uses).toString(),
      ),
    );
    contentElement.appendChild(
      HeaderAndContent(
        i18next.t("userpass_user_view_token_peroid"),
        String(user.token_period).toString(),
      ),
    );
    contentElement.appendChild(
      HeaderAndContent(i18next.t("userpass_user_view_policies"), user.token_policies.join()),
    );
    contentElement.appendChild(
      HeaderAndContent(
        i18next.t("userpass_user_view_initial_ttl"),
        String(user.token_ttl).toString(),
      ),
    );
    contentElement.appendChild(
      HeaderAndContent(i18next.t("userpass_user_view_type"), user.token_type),
    );
  }

  get name(): string {
    return i18next.t("userpass_user_view_title");
  }
}
