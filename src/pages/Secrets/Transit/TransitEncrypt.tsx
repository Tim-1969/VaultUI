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
import { transitEncrypt } from "../../../api/transit/transitEncrypt";
import UIkit from "uikit";
import i18next from "i18next";

export class TransitEncryptPage extends Page {
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
            name="plaintext"
            placeholder={i18next.t("transit_encrypt_input_placeholder")}
          />
        </Margin>
        <Margin>
          <FileUploadInput name="plaintext_file" />
        </Margin>
        <InputWithTitle title={i18next.t("transit_encrypt_already_encoded_checkbox")}>
          <input class="uk-checkbox" name="base64Checkbox" type="checkbox" />
        </InputWithTitle>
        <p class="uk-text-danger" id="errorText" />
        <button class="uk-button uk-button-primary" type="submit">
          {i18next.t("transit_encrypt_encrypt_btn")}
        </button>
        <div id="modalAttachmentPoint" />
      </Form>,
      this.router.pageContentElement,
    );
  }

  async onSubmit(data: FormData): Promise<void> {
    const base64Checkbox = data.get("base64Checkbox") as string;

    let plaintext = data.get("plaintext") as string;

    const plaintext_file = data.get("plaintext_file") as File;
    if (plaintext_file.size > 0) {
      plaintext = (await fileToBase64(plaintext_file)).replace("data:text/plain;base64,", "");
      plaintext = base64Checkbox == "on" ? atob(plaintext) : plaintext;
    } else {
      plaintext = base64Checkbox == "on" ? plaintext : btoa(plaintext);
    }

    try {
      const res = await transitEncrypt(this.state.baseMount, this.state.secretItem, {
        plaintext: plaintext,
      });
      render(
        <CopyableModal
          id="transitResultModal"
          name={i18next.t("transit_encrypt_encryption_result_modal_title")}
          contentString={res.ciphertext}
        />,
        document.querySelector("#modalAttachmentPoint"),
      );
      UIkit.modal(document.querySelector("#transitResultModal")).show();
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(`API Error: ${error.message}`);
    }
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router, i18next.t("transit_encrypt_suffix"));
  }

  get name(): string {
    return i18next.t("transit_encrypt_title");
  }
}
