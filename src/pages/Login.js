import { Page } from "../types/Page.js";
import { lookupSelf, usernameLogin } from "../api.js";
import { setPageContent, setErrorText, changePage } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import { Margin } from "../elements/Margin.js";
import { MarginInline } from "../elements/MarginInline.js";

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
            placeholder: "Token",
            name: "token"
          }
        })),
        MarginInline(makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: "Log In",
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
            placeholder: "Username",
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
            placeholder: "Password",
            name: "password"
          }
        })),
        MarginInline(makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: "Log In",
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
                text: "Token"
              })
            }),
            makeElement({
              tag: "li",
              children: makeElement({
                tag: "a",
                text: "Username"
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
      localStorage.setItem('token', token);
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
        localStorage.setItem("token", res);
        changePage("HOME");
      }).catch(e => {
        document.getElementById("usernameInput").classList.add("uk-form-danger");
        document.getElementById("passwordInput").classList.add("uk-form-danger");
        setErrorText(e.message);
      });
    });
  }

  get name() {
    return "Login";
  }
}