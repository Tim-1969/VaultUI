import { Margin } from "../elements/Margin.js";
import { MarginInline } from "../elements/MarginInline.js";
import { Page } from "../types/Page.js";
import { changePage, setErrorText, setPageContent } from "../pageUtils.js";
import { lookupSelf, usernameLogin } from "../api.js";
import { makeElement } from "../htmlUtils.js";
import i18next from 'i18next';

export class LoginPage extends Page {
  constructor() {
    super();
  }
  render() {
    let tokenLoginForm = makeElement({
      tag: "form",
      children: [
        Margin(makeElement({
          tag: "input",
          class: ["uk-input", "uk-form-width-medium"],
          attributes: {
            required: true,
            type: "password",
            placeholder: i18next.t("token_input"),
            name: "token"
          }
        })),
        MarginInline(makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: i18next.t("log_in_btn"),
          attributes: {
            type: "submit"
          }
        }))
      ]
    });

    let usernameLoginForm = makeElement({
      tag: "form",
      children: [
        Margin(makeElement({
          tag: "input",
          id: "usernameInput",
          class: ["uk-input", "uk-form-width-medium"],
          attributes: {
            required: true,
            type: "text",
            placeholder: i18next.t("username_input"),
            name: "username"
          }
        })),
        Margin(makeElement({
          tag: "input",
          id: "passwordInput",
          class: ["uk-input", "uk-form-width-medium"],
          attributes: {
            required: true,
            type: "password",
            placeholder: i18next.t("password_input"),
            name: "password"
          }
        })),
        MarginInline(makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: i18next.t("log_in_btn"),
          attributes: {
            type: "submit"
          }
        }))
      ]
    });

    setPageContent(makeElement({
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
                text: i18next.t("log_in_with_token")
              })
            }),
            makeElement({
              tag: "li",
              children: makeElement({
                tag: "a",
                text: i18next.t("log_in_with_username")
              })
            })
          ]
        }),
        makeElement({
          tag: "p",
          id: "errorText",
          class: "uk-text-danger"
        }),
        makeElement({
          tag: "ul",
          class: ["uk-switcher", "uk-margin"],
          children: [
            makeElement({
              tag: "li",
              children: tokenLoginForm
            }),
            makeElement({
              tag: "li",
              children: usernameLoginForm
            })
          ]
        })
      ]
    }));

    tokenLoginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let formData = new FormData(tokenLoginForm);
      const token = formData.get("token");
      pageState.token = token;
      lookupSelf().then(_ => {
        changePage("HOME");
      }).catch(e => {
        document.getElementById("tokenInput").classList.add("uk-form-danger");
        setErrorText(e.message);
      });
    });
    usernameLoginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let formData = new FormData(usernameLoginForm);
      usernameLogin(formData.get("username"), formData.get("password")).then(res => {
        pageState.token = res;
        changePage("HOME");
      }).catch(e => {
        document.getElementById("usernameInput").classList.add("uk-form-danger");
        document.getElementById("passwordInput").classList.add("uk-form-danger");
        setErrorText(e.message);
      });
    });
  }

  get name() {
    return i18next.t("log_in_title");
  }
}