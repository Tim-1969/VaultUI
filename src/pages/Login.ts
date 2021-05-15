import { Margin } from "../elements/Margin";
import { MarginInline } from "../elements/MarginInline";
import { Page } from "../PageSystem/Page";
import { lookupSelf } from "../api/sys/lookupSelf";
import { makeElement } from "../htmlUtils";
import { setErrorText } from "../pageUtils";
import { usernameLogin } from "../api/auth/usernameLogin";
import i18next from "i18next";

export class LoginPage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    const tokenLoginForm = makeElement({
      tag: "form",
      children: [
        Margin(
          makeElement({
            tag: "input",
            class: ["uk-input", "uk-form-width-medium"],
            attributes: {
              required: "true",
              type: "password",
              placeholder: i18next.t("token_input"),
              name: "token",
            },
          }),
        ),
        MarginInline(
          makeElement({
            tag: "button",
            class: ["uk-button", "uk-button-primary"],
            text: i18next.t("log_in_btn"),
            attributes: {
              type: "submit",
            },
          }),
        ),
      ],
    }) as HTMLFormElement;

    const usernameLoginForm = makeElement({
      tag: "form",
      children: [
        Margin(
          makeElement({
            tag: "input",
            id: "usernameInput",
            class: ["uk-input", "uk-form-width-medium"],
            attributes: {
              required: "true",
              type: "text",
              placeholder: i18next.t("username_input"),
              name: "username",
            },
          }),
        ),
        Margin(
          makeElement({
            tag: "input",
            id: "passwordInput",
            class: ["uk-input", "uk-form-width-medium"],
            attributes: {
              required: "true",
              type: "password",
              placeholder: i18next.t("password_input"),
              name: "password",
            },
          }),
        ),
        MarginInline(
          makeElement({
            tag: "button",
            class: ["uk-button", "uk-button-primary"],
            text: i18next.t("log_in_btn"),
            attributes: {
              type: "submit",
            },
          }),
        ),
      ],
    }) as HTMLFormElement;

    await this.router.setPageContent(
      makeElement({
        tag: "div",
        children: [
          makeElement({
            tag: "ul",
            class: ["uk-subnav", "uk-subnav-pill"],
            attributes: { "uk-switcher": "" },
            children: [
              makeElement({
                tag: "li",
                id: "tokenInput",
                children: makeElement({
                  tag: "a",
                  text: i18next.t("log_in_with_token"),
                }),
              }),
              makeElement({
                tag: "li",
                children: makeElement({
                  tag: "a",
                  text: i18next.t("log_in_with_username"),
                }),
              }),
            ],
          }),
          makeElement({
            tag: "p",
            id: "errorText",
            class: "uk-text-danger",
          }),
          makeElement({
            tag: "ul",
            class: ["uk-switcher", "uk-margin"],
            children: [
              makeElement({
                tag: "li",
                children: tokenLoginForm,
              }),
              makeElement({
                tag: "li",
                children: usernameLoginForm,
              }),
            ],
          }),
        ],
      }),
    );

    tokenLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(tokenLoginForm);
      const token = formData.get("token");
      this.state.token = token as string;

      try {
        await lookupSelf();
        await this.router.changePage("HOME");
      } catch (e: unknown) {
        const error = e as Error;
        document.getElementById("tokenInput").classList.add("uk-form-danger");
        if (error.message == "permission denied") {
          setErrorText(i18next.t("token_login_error"));
        } else {
          setErrorText(error.message);
        }
      }
    });
    usernameLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(usernameLoginForm);

      try {
        const res = await usernameLogin(
          formData.get("username") as string,
          formData.get("password") as string,
        );
        this.state.token = res;
        await this.router.changePage("HOME");
      } catch (e: unknown) {
        const error = e as Error;
        document.getElementById("usernameInput").classList.add("uk-form-danger");
        document.getElementById("passwordInput").classList.add("uk-form-danger");
        setErrorText(error.message);
      }
    });
  }

  get name(): string {
    return i18next.t("log_in_title");
  }
}
