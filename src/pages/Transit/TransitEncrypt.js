import { Page } from "../../types/Page.js";
import { transitEncrypt } from "../../api.js";
import { setPageContent, setTitleElement, setErrorText } from "../../pageUtils.js";
import { makeElement } from "../../htmlUtils.js";
import { Margin } from "../../elements/Margin.js";
import { CopyableModal } from "../../elements/CopyableModal.js";
import UIkit from 'uikit/dist/js/uikit.min.js';


export class TransitEncryptPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage(pages.TRANSIT_VIEW_SECRET);
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
      this.transitEncryptFormHandler();
    }.bind(this));
  }

  transitEncryptFormHandler() {
    let formData = new FormData(this.transitEncryptForm);
    let encodedData = formData.get("base64Checkbox") ? formData.get("plaintext") : btoa(formData.get("plaintext"));
    transitEncrypt(pageState.currentBaseMount, pageState.currentSecret, encodedData).then(res => {
      console.log(res);
      let modal = CopyableModal("Encryption Result", res.ciphertext);
      pageContent.appendChild(modal);
      UIkit.modal(modal).show();
    }).catch(e => {
      setErrorText(`API Error: ${e.message}`);
    });
  }

  get name() {
    return "Transit Encrypt";
  }
}
