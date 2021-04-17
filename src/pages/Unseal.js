import { Page } from "../types/Page.js";
import { submitUnsealKey, getSealStatus } from "../api.js";
import { setPageContent, setErrorText, changePage } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import { Margin } from "../elements/Margin.js";
import { MarginInline } from "../elements/MarginInline.js";

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
            placeholder: "Key",
            name: "key"
          }
        })),
        MarginInline(makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: "Submit Key"
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
      text: "Keys: 0/0",
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
    text.innerText = `Keys: ${progress}/${keysNeeded}`;
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

    submitUnsealKey(formData.get("key")).then(resp => {
      getSealStatus().then(data => {
        this.updateSealProgress(data);
      });
    }).catch(e => {
      setErrorText(e.message);
    });
  }
  get name() {
    return "Unseal";
  }
}