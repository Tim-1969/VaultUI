import { Form } from "../../../../elements/Form";
import { InputWithTitle } from "../../../../elements/InputWithTitle";
import { Page } from "../../../../types/Page";
import { UserType } from "../../../../api/types/userpass/user";
import { createOrUpdateUserPassUser } from "../../../../api/auth/userpass/createOrUpdateUserPassUser";
import { getUserPassUser } from "../../../../api/auth/userpass/getUserPassUser";
import { makeElement } from "z-makeelement";
import { setErrorText } from "../../../../pageUtils";
import { toStr } from "../../../../utils";
import i18next from "i18next";

const removeEmptyStrings = (arr: string[]) => arr.filter((e) => e.length > 0);

export class UserPassUserEditPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("USERPASS_USER_VIEW");
  }

  async render(): Promise<void> {
    const user = await getUserPassUser(this.state.authPath, this.state.userPassUser);

    await this.router.setPageContent(
      Form(
        [
          makeElement({
            tag: "input",
            class: "uk-input uk-form-width-large",
            attributes: {
              type: "password",
              name: "password",
              placeholder: i18next.t("userpass_common_password"),
            },
          }),

          InputWithTitle(
            i18next.t("userpass_common_cidrs"),
            makeElement({
              tag: "input",
              class: "uk-input uk-form-width-large",
              attributes: {
                name: "cidrs",
                value: user.token_bound_cidrs.join(),
              },
            }),
          ),
          InputWithTitle(
            i18next.t("userpass_common_exp_max_ttl"),
            makeElement({
              tag: "input",
              class: "uk-input uk-form-width-large",
              attributes: {
                name: "exp_max_ttl",
                type: "number",
                value: toStr(user.token_explicit_max_ttl),
              },
            }),
          ),
          InputWithTitle(
            i18next.t("userpass_common_max_ttl"),
            makeElement({
              tag: "input",
              class: "uk-input uk-form-width-large",
              attributes: {
                name: "max_ttl",
                type: "number",
                value: toStr(user.token_max_ttl),
              },
            }),
          ),
          InputWithTitle(
            i18next.t("userpass_common_default_policy_attached"),
            makeElement({
              tag: "input",
              class: "uk-checkbox",
              attributes: {
                name: "def_pol_attached",
                type: "checkbox",
                value: toStr(user.token_no_default_policy),
              },
            }),
          ),
          InputWithTitle(
            i18next.t("userpass_common_max_token_uses"),
            makeElement({
              tag: "input",
              class: "uk-input uk-form-width-large",
              attributes: {
                name: "max_uses",
                type: "number",
                value: toStr(user.token_num_uses),
              },
            }),
          ),
          InputWithTitle(
            i18next.t("userpass_common_token_peroid"),
            makeElement({
              tag: "input",
              class: "uk-input uk-form-width-large",
              attributes: {
                name: "period",
                type: "number",
                value: toStr(user.token_period),
              },
            }),
          ),
          InputWithTitle(
            i18next.t("userpass_common_policies"),
            makeElement({
              tag: "input",
              class: "uk-input uk-form-width-large",
              attributes: {
                name: "policies",
                value: user.token_policies.join(),
              },
            }),
          ),
          InputWithTitle(
            i18next.t("userpass_common_initial_ttl"),
            makeElement({
              tag: "input",
              class: "uk-input uk-form-width-large",
              attributes: {
                name: "initial_ttl",
                type: "number",
                value: toStr(user.token_ttl),
              },
            }),
          ),
          makeElement({
            tag: "p",
            id: "errorText",
            class: "uk-text-danger",
          }),
          makeElement({
            tag: "button",
            class: ["uk-button", "uk-button-primary"],
            text: i18next.t("userpass_user_edit_submit_btn"),
            attributes: {
              type: "submit",
            },
          }),
        ],
        async (form: HTMLFormElement) => {
          const data = new FormData(form);
          const apiData: Partial<UserType> = {
            token_bound_cidrs: removeEmptyStrings(String(data.get("cidrs")).split(",")),
            token_explicit_max_ttl: parseInt(data.get("exp_max_ttl") as string, 10),
            token_max_ttl: parseInt(data.get("max_ttl") as string, 10),
            token_no_default_policy: (data.get("def_pol_attached") as string) == "true",
            token_num_uses: parseInt(data.get("max_uses") as string, 10),
            token_period: parseInt(data.get("period") as string, 10),
            token_policies: removeEmptyStrings(String(data.get("policies")).split(",")),
            token_ttl: parseInt(data.get("initial_ttl") as string, 10),
          };
          const password = data.get("password") as string;
          if (password.length > 0) {
            apiData.password = password;
          }
          try {
            await createOrUpdateUserPassUser(this.state.authPath, this.state.userPassUser, apiData);
            await this.router.changePage("USERPASS_USER_VIEW");
          } catch (e: unknown) {
            const error = e as Error;
            setErrorText(error.message);
          }
        },
      ),
    );
  }

  get name(): string {
    return i18next.t("userpass_user_edit_title");
  }
}
