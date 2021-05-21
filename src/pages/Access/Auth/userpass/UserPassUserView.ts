import { HeaderAndContent } from "../../../../elements/HeaderAndContent";
import { Page } from "../../../../types/Page";
import { getUserPassUser } from "../../../../api/auth/userpass/getUserPassUser";
import { makeElement } from "z-makeelement";
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
    const contentElement = makeElement({ tag: "div" });
    await this.router.setPageContent(contentElement);

    contentElement.appendChild(
      makeElement({
        tag: "button",
        class: ["uk-button", "uk-margin", "uk-button-primary"],
        onclick: async () => {
          await this.router.changePage("USERPASS_USER_EDIT");
        },
        text: i18next.t("userpass_user_view_edit_btn"),
      }),
    );

    const tableElement = makeElement({
      tag: "table",
      class: "uk-table",
    });
    contentElement.appendChild(tableElement);

    const tableBody = makeElement({ tag: "tbody" });
    tableElement.appendChild(tableBody);

    const user = await getUserPassUser(this.state.authPath, this.state.userPassUser);

    tableBody.appendChild(
      HeaderAndContent(i18next.t("userpass_common_cidrs"), user.token_bound_cidrs.join()),
    );
    tableBody.appendChild(
      HeaderAndContent(
        i18next.t("userpass_common_exp_max_ttl"),
        toStr(user.token_explicit_max_ttl),
      ),
    );
    tableBody.appendChild(
      HeaderAndContent(i18next.t("userpass_common_max_ttl"), toStr(user.token_max_ttl)),
    );
    tableBody.appendChild(
      HeaderAndContent(
        i18next.t("userpass_common_default_policy_attached"),
        toStr(user.token_no_default_policy),
      ),
    );
    tableBody.appendChild(
      HeaderAndContent(i18next.t("userpass_common_max_token_uses"), toStr(user.token_num_uses)),
    );
    tableBody.appendChild(
      HeaderAndContent(i18next.t("userpass_common_token_peroid"), toStr(user.token_period)),
    );
    tableBody.appendChild(
      HeaderAndContent(i18next.t("userpass_common_policies"), user.token_policies.join()),
    );
    tableBody.appendChild(
      HeaderAndContent(i18next.t("userpass_common_initial_ttl"), toStr(user.token_ttl)),
    );
    tableBody.appendChild(HeaderAndContent(i18next.t("userpass_common_type"), user.token_type));
  }

  get name(): string {
    return i18next.t("userpass_user_view_title");
  }
}
