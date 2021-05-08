import { CopyableModal } from "../../elements/CopyableModal";
import { Margin } from "../../elements/Margin";
import { Page } from "../../types/Page";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import { transitDecrypt } from "../../api/transitDecrypt";
import UIkit from 'uikit/dist/js/uikit.min.js';
import i18next from "i18next";

export class TransitDecryptPage extends Page {
  constructor() {
    super();
  }

  goBack(): void {
    changePage("TRANSIT_VIEW_SECRET");
  }

  transitDecryptForm: HTMLFormElement;

  async render(): Promise<void> {
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
              class: "uk-checkbox",
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
    }) as HTMLFormElement;
    setPageContent(this.transitDecryptForm);
    this.transitDecryptForm.addEventListener("submit", function (e: Event) {
      e.preventDefault();
      this.transitEncryptFormHandler();
    }.bind(this));
  }

  transitEncryptFormHandler(): void {
    const formData = new FormData(this.transitDecryptForm);

    transitDecrypt(pageState.currentBaseMount, pageState.currentSecret, formData.get("ciphertext") as string).then(res => {
      let plaintext = res.plaintext;
      if (formData.get("decodeBase64Checkbox") as string == "on") {
        plaintext = atob(plaintext);
      }
      const modal = CopyableModal(i18next.t("transit_decrypt_decryption_result_modal_title"), plaintext);
      document.body.querySelector("#pageContent").appendChild(modal);
      UIkit.modal(modal).show();
    }).catch(e => {
      setErrorText(`API Error: ${e.message}`);
    });
  }

  get titleSuffix(): string {
    return i18next.t("transit_decrypt_suffix");
  }

  get name(): string {
    return i18next.t("transit_decrypt_title");
  }
}
