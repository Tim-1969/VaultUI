import { Page } from "../../types/Page.js";
import { transitDecrypt } from "../../api.js";
import { setPageContent, setTitleElement, setErrorText, changePage } from "../../pageUtils.js";
import { makeElement } from "../../htmlUtils.js";
import { Margin } from "../../elements/Margin.js";
import { CopyableModal } from "../../elements/CopyableModal.js";
import UIkit from 'uikit/dist/js/uikit.min.js';
import i18next from "i18next";


export class TransitDecryptPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage("TRANSIT_VIEW_SECRET");
  }
  async render() {
    setTitleElement(pageState);
    setPageContent(makeElement({
      tag: "div"
    }));
    this.transitDecryptForm = makeElement({
      tag: "form",
      children: [
        Margin(makeElement({
          tag: "textarea",
          class: ["uk-textarea", "uk-form-width-medium"],
          attributes: {
            placeholder: i18next.t("transit_decrypt_input_placeholder"),
            name: "ciphertext",
          }
        })),
        Margin([
          makeElement({
            tag: "div",
            class: "uk-form-label",
            text: i18next.t("transit_decrypt_decode_checkbox"),
          }),
          makeElement({
            tag: "div",
            class: ["uk-form-controls", "uk-form-controls-text"],
            children: makeElement({
              tag: "input",
              attributes: {
                type: "checkbox",
                name: "decodeBase64Checkbox",
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
          text: i18next.t("transit_decrypt_decrypt_btn"),
          attributes: {
            type: "submit",
          }
        })
      ]
    });
    setPageContent(this.transitDecryptForm);
    this.transitDecryptForm.addEventListener("submit", function (e) {
      e.preventDefault();
      this.transitEncryptFormHandler();
    }.bind(this));
  }

  transitEncryptFormHandler() {
    let formData = new FormData(this.transitDecryptForm);

    transitDecrypt(pageState.currentBaseMount, pageState.currentSecret, formData.get("ciphertext")).then(res => {
      let plaintext = res.plaintext;
      if (formData.get("decodeBase64Checkbox") == "on") {
        plaintext = atob(plaintext);
      }
      let modal = CopyableModal(i18next.t("transit_decrypt_decryption_result_modal_title"), plaintext);
      pageContent.appendChild(modal);
      UIkit.modal(modal).show();
    }).catch(e => {
      setErrorText(`API Error: ${e.message}`);
    });
  }

  get titleSuffix() {
    return i18next.t("transit_decrypt_suffix");
  }

  get name() {
    return i18next.t("transit_decrypt_title");
  }
}
