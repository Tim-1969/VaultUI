import { Page } from "../types/Page.js";
import { addNewTOTP } from "../api.js";
import { setTitleElement, setPageContent, setErrorText, changePage } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import { Margin } from "../elements/Margin.js";
import { MarginInline } from "../elements/MarginInline.js";

export class NewTOTPPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage(pages.TOTP);
  }
  render() {
    setTitleElement(pageState);

    let totpForm = makeElement({
      tag: "form",
      children: [
        Margin(makeElement({
          tag: "input",
          class: ["uk-input", "uk-form-width-medium"],
          attributes: {
            required: true,
            type: "text",
            placeholder: "TOTP Name",
            name: "name"
          }
        })),
        makeElement({
          tag: "p",
          text: "You need either a key or a URI, URI prefered. Just scan the QR code and copy the UI."
        }),
        Margin(makeElement({
          tag: "input",
          class: ["uk-input", "uk-form-width-medium"],
          attributes: {
            required: true,
            type: "text",
            placeholder: "URI",
            name: "uri"
          }
        })),
        Margin(makeElement({
          tag: "input",
          class: ["uk-input", "uk-form-width-medium"],
          attributes: {
            required: true,
            type: "text",
            placeholder: "Key",
            name: "key"
          }
        })),
        makeElement({
          tag: "p",
          id: "errorText",
          class: "uk-text-danger"
        }),
        MarginInline(makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: "Add",
          attributes: {
            type: "submit"
          }
        }))
      ]

    });
    setPageContent(totpForm);

    totpForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let formData = new FormData(totpForm);
      let parms = {
        url: formData.get("uri"),
        key: formData.get("key"),
        name: formData.get("name"),
        generate: false
      };
      addNewTOTP(pageState.currentBaseMount, parms).then(res => {
        changePage(pages.TOTP);
      }).catch(e => {
        setErrorText(`API Error: ${e.message}`);
      });
    });
  }
  get name() {
    return "Create New TOTP";
  }
}