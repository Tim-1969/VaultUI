import { Form } from "../../../../elements/Form";
import { Margin } from "../../../../elements/Margin";
import { MarginInline } from "../../../../elements/MarginInline";
import { Page } from "../../../../types/Page";
import { UserType } from "../../../../api/types/userpass/user";
import { createOrUpdateUserPassUser } from "../../../../api/auth/userpass/createOrUpdateUserPassUser";
import { render } from "preact";
import { setErrorText } from "../../../../pageUtils";
import i18next from "i18next";

export class UserPassUserNewPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("USERPASS_USERS_LIST");
  }

  async render(): Promise<void> {
    render(
      <Form onSubmit={(data) => this.onSubmit(data)}>
        <Margin>
          <input
            class="uk-input uk-form-width-large"
            name="username"
            type="text"
            placeholder={i18next.t("auth_common_username")}
          />
        </Margin>
        <Margin>
          <input
            class="uk-input uk-form-width-large"
            name="password"
            type="password"
            placeholder={i18next.t("auth_common_password")}
          />
        </Margin>
        <p class="uk-text-danger" id="errorText" />
        <MarginInline>
          <button class="uk-button uk-button-primary" type="submit">
            {i18next.t("userpass_user_new_create_btn")}
          </button>
        </MarginInline>
      </Form>,
      this.router.pageContentElement,
    );
  }

  async onSubmit(data: FormData): Promise<void> {
    const apiData: Partial<UserType> = {
      password: data.get("password") as string,
    };
    try {
      await createOrUpdateUserPassUser(
        this.state.authPath,
        data.get("username") as string,
        apiData,
      );
      await this.router.changePage("USERPASS_USERS_LIST");
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(error.message);
    }
  }

  get name(): string {
    return i18next.t("userpass_user_new_title");
  }
}
