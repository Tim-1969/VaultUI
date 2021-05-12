import { MarginInline } from "../elements/MarginInline";
import { Page } from "../types/Page";
import { QRScanner, QRScannerType } from "../elements/QRScanner";
import { SealStatusType, getSealStatus } from "../api/sys/getSealStatus";
import { changePage, setErrorText, setPageContent } from "../pageUtils";
import { makeElement } from "../htmlUtils";
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
    const id = setInterval(() => {
      void (this as UnsealPage).doRefresh().then(() => {});
      return;
    }, 1000);
    this.refresher = id as unknown as number;
  }

  async doRefresh(): Promise<void> {
    const status = await getSealStatus();
    this.updateSealProgress(status);
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
    setPageContent(
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
    this.switchInputMode(this.mode);
    this.updateSealProgress(await getSealStatus());
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
        onclick: () => {
          this.switchInputMode(newMethod);
        },
      }),
    );
  }

  switchInputMode(method: string): void {
    this.deinitWebcam();
    this.unsealInputContent.querySelectorAll("*").forEach((n) => n.remove());
    if (method == UnsealInputModes.FORM_INPUT) this.makeUnsealForm();
    if (method == UnsealInputModes.QR_INPUT) void this.makeQRInput();
    this.setButtons(method);
  }

  makeUnsealForm(): void {
    this.unsealKeyForm = makeElement({
      tag: "form",
      children: [
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
    }) as HTMLFormElement;
    this.unsealInputContent.appendChild(this.unsealKeyForm);
    this.unsealKeyForm.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      void this.handleKeySubmit();
    });
  }

  async makeQRInput(): Promise<void> {
    this.qrScanner = await QRScanner((code: string) => {
      this.submitKey(code);
    });
    this.unsealInputContent.appendChild(this.qrScanner);
  }

  updateSealProgress(data: SealStatusType): void {
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
      void changePage("HOME");
    }
  }

  submitKey(key: string): void {
    submitUnsealKey(key)
      .then((_) => {
        void getSealStatus().then((data) => {
          void this.updateSealProgress(data);
        });
      })
      .catch((e: Error) => {
        setErrorText(e.message);
      });
  }

  handleKeySubmit(): void {
    const formData = new FormData(this.unsealKeyForm);

    this.submitKey(formData.get("key") as string);
  }
  get name(): string {
    return i18next.t("unseal_vault_text");
  }
}
