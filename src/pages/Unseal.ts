import { Form } from "../elements/Form";
import { MarginInline } from "../elements/MarginInline";
import { Page } from "../types/Page";
import { QRScanner, QRScannerType } from "../elements/QRScanner";
import { SealStatusType, getSealStatus } from "../api/sys/getSealStatus";
import { makeElement } from "z-makeelement";
import { setErrorText } from "../pageUtils";
import { submitUnsealKey } from "../api/sys/submitUnsealKey";
import i18next from "i18next";

const UnsealInputModes = {
  FORM_INPUT: "FORM_INPUT",
  QR_INPUT: "QR_INPUT",
};

export class UnsealPage extends Page {
  constructor() {
    super();
    this.mode = UnsealInputModes.FORM_INPUT;
  }

  mode: string;
  refresher: number;
  qrScanner: QRScannerType;
  unsealProgress: HTMLProgressElement;
  unsealProgressText: HTMLParagraphElement;
  unsealInputContent: HTMLElement;
  unsealKeyForm: HTMLFormElement;

  async cleanup(): Promise<void> {
    this.deinitWebcam();
    clearInterval(this.refresher);
  }

  deinitWebcam(): void {
    try {
      this.qrScanner.deinit();
    } catch (_) {
      // Do Nothing
    }
  }

  makeRefresher(): void {
    const id = setInterval(async () => {
      await this.doRefresh();
      return;
    }, 1000);
    this.refresher = id as unknown as number;
  }

  async doRefresh(): Promise<void> {
    const status = await getSealStatus();
    await this.updateSealProgress(status);
  }

  async render(): Promise<void> {
    this.unsealProgress = makeElement({
      tag: "progress",
      class: "uk-progress",
      attributes: { value: "0", max: "0" },
    }) as HTMLProgressElement;
    this.unsealProgressText = makeElement({
      tag: "p",
      text: i18next.t("unseal_keys_progress", {
        progress: "0",
        keys_needed: "0",
      }),
    }) as HTMLParagraphElement;
    this.unsealInputContent = makeElement({
      tag: "div",
    });
    await this.router.setPageContent(
      makeElement({
        tag: "div",
        children: [
          this.unsealProgress,
          makeElement({
            tag: "p",
            id: "errorText",
            class: ["uk-text-danger", "uk-margin-top"],
          }),
          this.unsealProgressText,
          this.unsealInputContent,
        ],
      }),
    );
    await this.switchInputMode(this.mode);
    await this.updateSealProgress(await getSealStatus());
    this.makeRefresher();
  }

  setButtons(method: string): void {
    const newMethod: string =
      method == UnsealInputModes.FORM_INPUT
        ? UnsealInputModes.QR_INPUT
        : UnsealInputModes.FORM_INPUT;
    const buttonText: string =
      newMethod == UnsealInputModes.FORM_INPUT
        ? i18next.t("unseal_input_btn")
        : i18next.t("unseal_qr_btn");
    this.unsealInputContent.appendChild(
      makeElement({
        tag: "button",
        class: ["uk-button", "uk-button-primary"],
        text: buttonText,
        onclick: async () => {
          await this.switchInputMode(newMethod);
        },
      }),
    );
  }

  async switchInputMode(method: string): Promise<void> {
    this.deinitWebcam();
    this.unsealInputContent.querySelectorAll("*").forEach((n) => n.remove());
    if (method == UnsealInputModes.FORM_INPUT) this.makeUnsealForm();
    if (method == UnsealInputModes.QR_INPUT) await this.makeQRInput();
    this.setButtons(method);
  }

  makeUnsealForm(): void {
    this.unsealKeyForm = Form(
      [
        MarginInline(
          makeElement({
            tag: "input",
            class: ["uk-input", "uk-form-width-medium"],
            attributes: {
              required: "true",
              type: "password",
              placeholder: i18next.t("key_input_placeholder"),
              name: "key",
            },
          }),
        ),
        MarginInline(
          makeElement({
            tag: "button",
            class: ["uk-button", "uk-button-primary"],
            text: i18next.t("submit_key_btn"),
          }),
        ),
      ],
      async (_) => {
        await this.handleKeySubmit();
      },
    );
    this.unsealInputContent.appendChild(this.unsealKeyForm);
  }

  async makeQRInput(): Promise<void> {
    this.qrScanner = await QRScanner(async (code: string) => {
      await this.submitKey(code);
    });
    this.unsealInputContent.appendChild(this.qrScanner);
  }

  async updateSealProgress(data: SealStatusType): Promise<void> {
    const progress = data.progress;
    const keysNeeded = data.t;
    const text = this.unsealProgressText;
    text.innerText = i18next.t("unseal_keys_progress", {
      progress: String(progress),
      keys_needed: String(keysNeeded),
    });
    const progressBar = this.unsealProgress;
    progressBar.value = progress;
    progressBar.max = keysNeeded;
    if (!data.sealed) {
      progressBar.value = keysNeeded;
      await this.router.changePage("HOME");
    }
  }

  async submitKey(key: string): Promise<void> {
    try {
      await submitUnsealKey(key);
      await this.updateSealProgress(await getSealStatus());
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(error.message);
    }
  }

  async handleKeySubmit(): Promise<void> {
    const formData = new FormData(this.unsealKeyForm);

    await this.submitKey(formData.get("key") as string);
  }
  get name(): string {
    return i18next.t("unseal_vault_text");
  }
}
