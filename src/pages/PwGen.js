import { CopyableInputBox } from "../elements/CopyableInputBox.js";
import { Margin } from "../elements/Margin.js";
import { Page } from "../types/Page.js";
import { makeElement } from "../htmlUtils.js";
import { setPageContent } from "../pageUtils.js";
import i18next from 'i18next';

const passwordLengthMin = 1;
const passwordLengthMax = 64;
const passwordLengthDefault = 24;


function random() {
  if (typeof window.crypto?.getRandomValues === 'function' && typeof window.Uint32Array === 'function') {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
  }

  return Math.random();
}

const passwordOptionsDefault = {
  length: passwordLengthDefault
}

function genPassword(options = passwordOptionsDefault) {
  let pw = "";
  const pwArray = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'()*+,-./:;<=>?@[]^_{|}~".split('');
  for (let i = 0; i < options.length; i++) {
    pw = pw.concat(pwArray[Math.floor(random() * pwArray.length)]);
  }
  return pw;
}


export class PwGenPage extends Page {
  constructor() {
    super();
  }


  async render() {
    this.passwordBox = CopyableInputBox(genPassword(passwordOptionsDefault));

    this.passwordLengthTitle = makeElement({
      tag: "h4",
      text: this.getPasswordLengthText()
    })

    this.passwordLengthRange = makeElement({
      tag: "input",
      name: "length",
      class: "uk-range",
      attributes: {
        type: "range",
        value: passwordLengthDefault,
        max: passwordLengthMax,
        min: passwordLengthMin,
      },
    })
    this.passwordLengthRange.addEventListener('input', this.updatePassword.bind(this));

    this.passwordForm = makeElement({
      tag: "form",
      children: [
        this.passwordBox,
        this.passwordLengthTitle,
        this.passwordLengthRange,
        Margin(makeElement({
          tag: "button",
          text: i18next.t("gen_password_btn"),
          class: ["uk-button", "uk-button-primary", "uk-margin-bottom"],
          attributes: {type: "submit"},
        }))
      ]
    });

    this.passwordForm.addEventListener("submit", (e) => this.formEvent(e));
    setPageContent(this.passwordForm);
  }

  getPasswordLengthText() {
    return i18next.t("password_length_title", {
      min: this?.passwordLengthRange?.value || 24,
      max: passwordLengthMax
    });
  }

  formEvent(e) {
    e.preventDefault();
    this.updatePassword();
  }

  updatePassword() {
    this.passwordLengthTitle.innerText = this.getPasswordLengthText();
    this.passwordBox.setText(
      genPassword({length: this.passwordLengthRange.value})
    );
  }

  get name() {
    return i18next.t("password_generator_title");
  }
}