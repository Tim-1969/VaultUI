import { CopyableModal } from "../../elements/CopyableModal.js";
import { Margin } from "../../elements/Margin.js";
import { Page } from "../../types/Page.js";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState.ts";
import { transitEncrypt } from "../../api/transitEncrypt";
import UIkit from 'uikit/dist/js/uikit.min.js';
import i18next from "i18next";


export class TransitEncryptPage extends Page {
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
    this.transitEncryptForm = makeElement({
      tag: "form",
      children: [
        Margin(makeElement({
          tag: "textarea",
          class: ["uk-textarea", "uk-form-width-medium"],
          attributes: {
            placeholder: i18next.t("transit_encrypt_input_placeholder"),
            name: "plaintext",
          }
        })),
        Margin([
          makeElement({
            tag: "div",
            class: "uk-form-label",
            text: i18next.t("transit_encrypt_already_encoded_checkbox"),
          }),
          makeElement({
            tag: "div",
            class: ["uk-form-controls", "uk-form-controls-text"],
            children: makeElement({
              tag: "input",
              class: "uk-checkbox",
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
          text: i18next.t("transit_encrypt_encrypt_btn"),
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
    let encodedData =
      formData.get("base64Checkbox") == "on" ? formData.get("plaintext") : btoa(formData.get("plaintext"));
    transitEncrypt(pageState.currentBaseMount, pageState.currentSecret, encodedData).then(res => {
      console.log(res);
      let modal = CopyableModal(i18next.t("transit_encrypt_encryption_result_modal_title"), res.ciphertext);
      pageContent.appendChild(modal);
      UIkit.modal(modal).show();
    }).catch(e => {
      setErrorText(`API Error: ${e.message}`);
    });
  }

  get titleSuffix() {
    return i18next.t("transit_encrypt_suffix");
  }

  get name() {
    return i18next.t("transit_encrypt_title");
  }
}
