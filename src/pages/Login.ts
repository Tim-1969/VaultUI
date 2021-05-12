import { Margin } from "../elements/Margin";
import { MarginInline } from "../elements/MarginInline";
import { Page } from "../types/Page";
import { changePage, setErrorText, setPageContent } from "../pageUtils";
import { lookupSelf } from "../api/sys/lookupSelf";
import { makeElement } from "../htmlUtils";
import { pageState } from "../globalPageState";
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

    setPageContent(
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

    tokenLoginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(tokenLoginForm);
      const token = formData.get("token");
      pageState.token = token as string;
      lookupSelf()
        .then((_) => {
          void changePage("HOME");
        })
        .catch((e: Error) => {
          document.getElementById("tokenInput").classList.add("uk-form-danger");
          if (e.message == "permission denied") {
            setErrorText(i18next.t("token_login_error"));
          } else {
            setErrorText(e.message);
          }
        });
    });
    usernameLoginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(usernameLoginForm);
      usernameLogin(formData.get("username") as string, formData.get("password") as string)
        .then((res) => {
          pageState.token = res;
          void changePage("HOME");
        })
        .catch((e: Error) => {
          document.getElementById("usernameInput").classList.add("uk-form-danger");
          document.getElementById("passwordInput").classList.add("uk-form-danger");
          setErrorText(e.message);
        });
    });
  }

  get name(): string {
    return i18next.t("log_in_title");
  }
}
