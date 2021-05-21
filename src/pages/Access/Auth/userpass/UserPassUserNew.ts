import { Form } from "../../../../elements/Form";
import { Page } from "../../../../types/Page";
import { UserType } from "../../../../api/types/userpass/user";
import { createOrUpdateUserPassUser } from "../../../../api/auth/userpass/createOrUpdateUserPassUser";
import { makeElement } from "z-makeelement";
import { setErrorText } from "../../../../pageUtils";
import i18next from "i18next";
import { Margin } from "../../../../elements/Margin";

export class UserPassUserNewPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("USERPASS_USERS_LIST");
  }

  async render(): Promise<void> {
    await this.router.setPageContent(
      Form(
        [
          Margin(makeElement({
            tag: "input",
            class: "uk-input uk-form-width-large",
            attributes: {
              name: "username",
              placeholder: i18next.t("userpass_common_username"),
            },
          })),
          Margin(makeElement({
            tag: "input",
            class: "uk-input uk-form-width-large",
            attributes: {
              type: "password",
              name: "password",
              placeholder: i18next.t("userpass_common_password"),
            },
          })),
          makeElement({
            tag: "p",
            id: "errorText",
            class: "uk-text-danger",
          }),
          makeElement({
            tag: "button",
            class: ["uk-button", "uk-button-primary"],
            text: i18next.t("userpass_user_new_create_btn"),
            attributes: {
              type: "submit",
            },
          }),
        ],
        async (form: HTMLFormElement) => {
          const data = new FormData(form);
          const apiData: Partial<UserType> = {
            password: data.get("password") as string,
          };
          try {
            await createOrUpdateUserPassUser(this.state.authPath, data.get("username") as string, apiData);
            await this.router.changePage("USERPASS_USERS_LIST");
          } catch (e: unknown) {
            const error = e as Error;
            setErrorText(error.message);
          }
        },
      ),
    );
  }

  get name(): string {
    return i18next.t("userpass_user_new_title");
  }
}
