import { Page } from "../types/Page.js";
import { setPageContent, setTitleElement } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import { Margin } from "../elements/Margin.js";

export class TransitEncryptPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage(pages.HOME);
  }
  async render() {
    setTitleElement(pageState);
    setPageContent(makeElement({
      tag: "div"
    }));
    this.transitEncryptForm = makeElement({
      tag: "form",
      children: [
        Margin(makeElement({
          tag: "textarea",
          class: ["uk-textarea", "uk-form-width-medium"],
          attributes: {
            placeholder: "Plaintext or base64",
            name: "plaintext",
          }
        })),
        Margin([
          makeElement({
            tag: "div",
            class: "uk-form-label",
            text: "Is the data already encoded in base64?",
          }),
          makeElement({
            tag: "div",
            class: ["uk-form-controls", "uk-form-controls-text"],
            children: makeElement({
              tag: "input",
              class: ["uk-checkbox"],
              attributes: {
                type: "checkbox",
                name: "base64Checkbox",
              }
            }),
          }),
        ]),
        makeElement({
          tag: "p",
          id: "errorText",
          class: "uk-text-danger"
        }),
        makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: "Encrypt",
          attributes: {
            type: "submit",
          }
        })
      ]
    });
    setPageContent(this.transitEncryptForm);

    this.transitEncryptForm.addEventListener("submit", function (e) {
      e.preventDefault();
      this.newKVSecretHandleForm();
    }.bind(this));
  }

  transitEncryptFormHandler() {
    alert("Not Yet Implemented");
  }

  get name() {
    return "Transit Encrypt";
  }
}
