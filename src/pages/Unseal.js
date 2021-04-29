import { Page } from "../types/Page.js";
import { submitUnsealKey, getSealStatus } from "../api.js";
import { setPageContent, setErrorText, changePage } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import { MarginInline } from "../elements/MarginInline.js";
import { QRScanner } from "../elements/QRScanner.js";
import i18next from 'i18next';

const UnsealInputModes = {
  FORM_INPUT: "FORM_INPUT",
  QR_INPUT: "QR_INPUT"
}

export class UnsealPage extends Page {
  constructor() {
    super();
    this.mode = UnsealInputModes.FORM_INPUT;
  }
  cleanup() {
    this.deinitWebcam()
    clearInterval(this.refresher);
  }

  deinitWebcam() {
    try {
      this.qrScanner.deinit();
    } catch (_) {
      ()=>{};
    }
  }

  makeRefresher() {
    this.refresher = setInterval(async function () {
      this.updateSealProgress(await getSealStatus());
    }.bind(this), 1000);
  }

  async render() {
    this.unsealProgress = makeElement({
      tag: "progress",
      class: "uk-progress",
      attributes: { value: "0", max: "0" }
    });
    this.unsealProgressText = makeElement({
      tag: "p",
      text: i18next.t("unseal_keys_progress", { progress: "0", keys_needed: "0" }),
    });
    this.unsealInputContent = makeElement({
      tag: "div"
    })
    setPageContent(makeElement({
      tag: "div",
      children: [
        this.unsealProgress,
        makeElement({
          tag: "p",
          id: "errorText",
          class: ["uk-text-danger", "uk-margin-top"]
        }),
        this.unsealProgressText,
        this.unsealInputContent
      ]
    }));
    this.switchInputMode(this.mode);
    this.updateSealProgress(await getSealStatus());
    this.makeRefresher();
  }

  setButtons(method) {
    let newMethod;
    let buttonText;
    newMethod = method == UnsealInputModes.FORM_INPUT ? UnsealInputModes.QR_INPUT : UnsealInputModes.FORM_INPUT;
    buttonText = newMethod == UnsealInputModes.FORM_INPUT ? i18next.t("unseal_input_btn") : i18next.t("unseal_qr_btn");
    this.unsealInputContent.appendChild(makeElement({
      tag: "button",
      class: ["uk-button", "uk-button-primary"],
      text: buttonText,
      onclick: () => {
        this.switchInputMode(newMethod);
      }
    }))
  }


  switchInputMode(method) {
    this.deinitWebcam();
    this.unsealInputContent.querySelectorAll('*').forEach(n => n.remove())
    if (method == UnsealInputModes.FORM_INPUT) this.makeUnsealForm();
    if (method == UnsealInputModes.QR_INPUT) this.makeQRInput();
    this.setButtons(method);
  }

  makeUnsealForm() {
    this.unsealKeyForm = makeElement({
      tag: "form",
      children: [
        MarginInline(makeElement({
          tag: "input",
          class: ["uk-input", "uk-form-width-medium"],
          attributes: {
            required: true,
            type: "password",
            placeholder: i18next.t("key_input_placeholder"),
            name: "key"
          }
        })),
        MarginInline(makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: i18next.t("submit_key_btn")
        })),
      ]
    });
    this.unsealInputContent.appendChild(this.unsealKeyForm);
    this.unsealKeyForm.addEventListener("submit", function (e) {
      e.preventDefault();
      this.handleKeySubmit();
    }.bind(this));
  }

  async makeQRInput() {
    this.qrScanner = await QRScanner(function (code) {
      this.submitKey(code);
      console.log('decoded qr code:', code)
    }.bind(this));
    this.unsealInputContent.appendChild(this.qrScanner);
  }

  updateSealProgress(data) {
    let progress = data.progress;
    let keysNeeded = data.t;
    let text = this.unsealProgressText;
    text.innerText = i18next.t("unseal_keys_progress", {
      progress: String(progress),
      keys_needed: String(keysNeeded)
    });
    let progressBar = this.unsealProgress;
    progressBar.value = progress;
    progressBar.max = keysNeeded;
    if (!data.sealed) {
      progressBar.value = keysNeeded;
      changePage("HOME");
    }
  }

  submitKey(key) {
    submitUnsealKey(key).then(_ => {
      getSealStatus().then(data => {
        this.updateSealProgress(data);
      });
    }).catch(e => {
      setErrorText(e.message);
    });
  }

  async handleKeySubmit() {
    let formData = new FormData(this.unsealKeyForm);

    this.submitKey(formData.get("key"))
  }
  get name() {
    return i18next.t("unseal_vault_text");
  }
}