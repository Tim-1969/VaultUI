import { Page } from "../types/Page.js";
import { setPageContent, changePage } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";

export class SetVaultURLPage extends Page {
  constructor() {
    super();
  }
  render() {
    setPageContent(makeElement({
      tag: "form",
      id: "setVaultURLForm",
      children: [
        makeElement({
          tag: "div",
          class: "uk-margin",
          children: makeElement({
            tag: "input",
            class: ["uk-input", "uk-form-width-medium"],
            attributes: {
              required: true,
              type: "text",
              placeholder: "Vault URL",
              name: "vaultURL"
            }
          })
        }),
        makeElement({
          tag: "p",
          id: "errorText",
          class: "uk-text-danger"
        }),
        makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: "Set",
          attributes: {
            type: "submit",
          }
        })
      ]
    }));
    document.getElementById("setVaultURLForm").addEventListener("submit", function (e) {
      e.preventDefault();
      let formData = new FormData(document.querySelector('#setVaultURLForm'));
      localStorage.setItem('apiurl', formData.get("vaultURL"));
      changePage("HOME");
    });
  }
  get name() {
    return "Set Vault URL";
  }
}
