import { CopyableModal } from "../../elements/CopyableModal";
import { Margin } from "../../elements/Margin";
import { Page } from "../../types/Page";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import { transitEncrypt } from "../../api/transitEncrypt";
import UIkit from 'uikit/dist/js/uikit.min.js';
import i18next from "i18next";


export class TransitEncryptPage extends Page {
  constructor() {
    super();
  }

  goBack(): void {
    changePage("TRANSIT_VIEW_SECRET");
  }

  transitEncryptForm: HTMLFormElement;


  async render(): Promise<void> {
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
    }) as HTMLFormElement;
    setPageContent(this.transitEncryptForm);

    this.transitEncryptForm.addEventListener("submit", function (e) {
      e.preventDefault();
      this.transitEncryptFormHandler();
    }.bind(this));
  }

  transitEncryptFormHandler(): void {
    const formData = new FormData(this.transitEncryptForm);
    const encodedData =
      formData.get("base64Checkbox") as string == "on" ? formData.get("plaintext") as string : btoa(formData.get("plaintext") as string);
    transitEncrypt(pageState.currentBaseMount, pageState.currentSecret, encodedData).then(res => {
      const modal = CopyableModal(i18next.t("transit_encrypt_encryption_result_modal_title"), res.ciphertext);
      document.body.querySelector("#pageContent").appendChild(modal);
      UIkit.modal(modal).show();
    }).catch(e => {
      setErrorText(`API Error: ${e.message}`);
    });
  }

  get titleSuffix(): string {
    return i18next.t("transit_encrypt_suffix");
  }

  get name(): string {
    return i18next.t("transit_encrypt_title");
  }
}
