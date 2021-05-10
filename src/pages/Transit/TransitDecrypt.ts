import { CopyableModal } from "../../elements/CopyableModal";
import { FileUploadInput } from "../../elements/FileUploadInput";
import { Margin } from "../../elements/Margin";
import { Page } from "../../types/Page";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { fileToBase64, makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import { transitDecrypt } from "../../api/transit/transitDecrypt";
import i18next from "i18next";

export class TransitDecryptPage extends Page {
  constructor() {
    super();
  }

  goBack(): void {
    changePage("TRANSIT_VIEW_SECRET");
  }

  transitDecryptForm: HTMLFormElement;

  render(): void {
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
        Margin(FileUploadInput("ciphertext_file")),
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
    this.transitDecryptForm.addEventListener("submit", async function (e: Event) {
      e.preventDefault();
      await (this as TransitDecryptPage).transitDecryptFormHandler();
    }.bind(this));
  }

  async transitDecryptFormHandler(): Promise<void> {
    const formData = new FormData(this.transitDecryptForm);

    const decodeBase64 = formData.get("decodeBase64Checkbox") as string;

    let ciphertext = formData.get("ciphertext") as string;

    const ciphertext_file = formData.get("ciphertext_file") as File;
    if (ciphertext_file.size > 0) {
      ciphertext = atob((await fileToBase64(ciphertext_file) ).replace("data:text/plain;base64,", ""));
    }

    try {
      const res = await transitDecrypt(
        pageState.currentBaseMount,
        pageState.currentSecret,
        { ciphertext: ciphertext },
      );
      let plaintext = res.plaintext;
      if (decodeBase64 == "on") {
        plaintext = atob(plaintext);
      }
      const modal = CopyableModal(i18next.t("transit_decrypt_decryption_result_modal_title"), plaintext);
      document.body.querySelector("#pageContent").appendChild(modal);
      modal.show();
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(`API Error: ${error.message}`);
    }
  }

  get titleSuffix(): string {
    return i18next.t("transit_decrypt_suffix");
  }

  get name(): string {
    return i18next.t("transit_decrypt_title");
  }
}
