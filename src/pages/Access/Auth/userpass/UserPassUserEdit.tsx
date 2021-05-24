import { Form } from "../../../../elements/ReactForm";
import { InputWithTitle } from "../../../../elements/InputWithTitle";
import { MarginInline } from "../../../../elements/ReactMarginInline";
import { Page } from "../../../../types/Page";
import { UserType } from "../../../../api/types/userpass/user";
import { createOrUpdateUserPassUser } from "../../../../api/auth/userpass/createOrUpdateUserPassUser";
import { getUserPassUser } from "../../../../api/auth/userpass/getUserPassUser";
import { render } from "preact";
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

    render(
      <Form onSubmit={(data) => this.onSubmit(data)}>
        <input
          class="uk-input uk-form-width-large"
          name="password"
          type="password"
          placeholder={i18next.t("userpass_common_password")}
        />
        <InputWithTitle title={i18next.t("userpass_common_cidrs")}>
          <input
            class="uk-input uk-form-width-large"
            name="cidrs"
            type="text"
            value={user.token_bound_cidrs.join()}
          />
        </InputWithTitle>
        <InputWithTitle title={i18next.t("userpass_common_exp_max_ttl")}>
          <input
            class="uk-input uk-form-width-large"
            name="exp_max_ttl"
            type="number"
            value={toStr(user.token_explicit_max_ttl)}
          />
        </InputWithTitle>
        <InputWithTitle title={i18next.t("userpass_common_max_ttl")}>
          <input
            class="uk-input uk-form-width-large"
            name="max_ttl"
            type="number"
            value={toStr(user.token_max_ttl)}
          />
        </InputWithTitle>
        <InputWithTitle title={i18next.t("userpass_common_default_policy_attached")}>
          <input
            class="uk-checkbox"
            name="def_pol_attached"
            type="checkbox"
            value={toStr(user.token_no_default_policy)}
          />
        </InputWithTitle>
        <InputWithTitle title={i18next.t("userpass_common_max_token_uses")}>
          <input
            class="uk-input uk-form-width-large"
            name="max_uses"
            type="number"
            value={toStr(user.token_num_uses)}
          />
        </InputWithTitle>
        <InputWithTitle title={i18next.t("userpass_common_token_peroid")}>
          <input
            class="uk-input uk-form-width-large"
            name="period"
            type="number"
            value={toStr(user.token_period)}
          />
        </InputWithTitle>
        <InputWithTitle title={i18next.t("userpass_common_policies")}>
          <input
            class="uk-input uk-form-width-large"
            name="policies"
            type="text"
            value={user.token_policies.join()}
          />
        </InputWithTitle>
        <InputWithTitle title={i18next.t("userpass_common_initial_ttl")}>
          <input
            class="uk-input uk-form-width-large"
            name="initial_ttl"
            type="number"
            value={toStr(user.token_ttl)}
          />
        </InputWithTitle>
        <p class="uk-text-danger" id="errorText" />
        <MarginInline>
          <button class="uk-button uk-button-primary" type="submit">
            {i18next.t("userpass_user_edit_submit_btn")}
          </button>
        </MarginInline>
      </Form>,
      this.router.pageContentElement,
    );
  }

  async onSubmit(data: FormData): Promise<void> {
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
  }

  get name(): string {
    return i18next.t("userpass_user_edit_title");
  }
}
