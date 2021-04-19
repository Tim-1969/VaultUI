import { Page } from "../types/Page.js";
import { submitUnsealKey, getSealStatus } from "../api.js";
import { setPageContent, setErrorText, changePage } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import { MarginInline } from "../elements/MarginInline.js";
import i18next from 'i18next';

export class UnsealPage extends Page {
  constructor() {
    super();
  }
  async render() {
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

    this.unsealProgress = makeElement({
      tag: "progress",
      class: "uk-progress",
      attributes: { value: "0", max: "0" }
    });
    this.unsealProgressText = makeElement({
      tag: "p",
      text: i18next.t("unseal_keys_progress", { progress: "0", keys_needed: "0" }),
    });

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
        this.unsealKeyForm
      ]
    }));
    this.unsealKeyForm.addEventListener("submit", function (e) {
      e.preventDefault();
      pageState.currentPage.handleKeySubmit();
    });
    this.updateSealProgress(await getSealStatus());
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

  async handleKeySubmit() {
    let formData = new FormData(this.unsealKeyForm);

    submitUnsealKey(formData.get("key")).then(_ => {
      getSealStatus().then(data => {
        this.updateSealProgress(data);
      });
    }).catch(e => {
      setErrorText(e.message);
    });
  }
  get name() {
    return i18next.t("unseal_vault_text");
  }
}