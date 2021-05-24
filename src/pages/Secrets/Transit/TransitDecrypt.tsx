import { CopyableModal } from "../../../elements/ReactCopyableModal";
import { FileUploadInput } from "../../../elements/ReactFileUploadInput";
import { Form } from "../../../elements/ReactForm";
import { InputWithTitle } from "../../../elements/ReactInputWithTitle";
import { Margin } from "../../../elements/ReactMargin";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { fileToBase64 } from "../../../htmlUtils";
import { render } from "preact";
import { setErrorText } from "../../../pageUtils";
import { transitDecrypt } from "../../../api/transit/transitDecrypt";
import UIkit from "uikit";
import i18next from "i18next";

export class TransitDecryptPage extends Page {
  constructor() {
    super();
  }

  async goBack(): Promise<void> {
    await this.router.changePage("TRANSIT_VIEW_SECRET");
  }

  async render(): Promise<void> {
    render(
      <Form onSubmit={async (data) => await this.onSubmit(data)}>
        <Margin>
          <textarea
            class="uk-textarea uk-form-width-medium"
            name="ciphertext"
            placeholder={i18next.t("transit_decrypt_input_placeholder")}
          />
        </Margin>
        <Margin>
          <FileUploadInput name="ciphertext_file" />
        </Margin>
        <InputWithTitle title={i18next.t("transit_decrypt_decode_checkbox")}>
          <input class="uk-checkbox" name="decodeBase64Checkbox" type="checkbox" />
        </InputWithTitle>
        <p class="uk-text-danger" id="errorText" />
        <button class="uk-button uk-button-primary" type="submit">
          {i18next.t("transit_decrypt_decrypt_btn")}
        </button>
        <div id="modalAttachmentPoint" />
      </Form>,
      this.router.pageContentElement,
    );
  }

  async onSubmit(data: FormData): Promise<void> {
    const decodeBase64 = data.get("decodeBase64Checkbox") as string;

    let ciphertext = data.get("ciphertext") as string;

    const ciphertext_file = data.get("ciphertext_file") as File;
    if (ciphertext_file.size > 0) {
      ciphertext = atob(
        (await fileToBase64(ciphertext_file)).replace("data:text/plain;base64,", ""),
      );
    }

    try {
      const res = await transitDecrypt(this.state.baseMount, this.state.secretItem, {
        ciphertext: ciphertext,
      });
      let plaintext = res.plaintext;
      if (decodeBase64 == "on") {
        plaintext = atob(plaintext);
      }
      render(
        <CopyableModal
          id="transitResultModal"
          name={i18next.t("transit_decrypt_decryption_result_modal_title")}
          contentString={plaintext}
        />,
        document.querySelector("#modalAttachmentPoint"),
      );
      UIkit.modal(document.querySelector("#transitResultModal")).show();
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(`API Error: ${error.message}`);
    }
  }

  async renderPageTitle(): Promise<void> {
    render(
      <SecretTitleElement router={this.router} suffix={i18next.t("transit_decrypt_suffix")} />,
      this.router.pageTitleElement,
    );
  }

  get name(): string {
    return i18next.t("transit_decrypt_title");
  }
}
