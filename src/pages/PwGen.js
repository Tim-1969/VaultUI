import { CopyableInputBox } from "../elements/CopyableInputBox";
import { Margin } from "../elements/Margin";
import { Page } from "../types/Page";
import { makeElement } from "../htmlUtils";
import { setPageContent } from "../pageUtils";
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

const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '1234567890';
const special = '!#$%&()*+,-./:;<=>?@[]^_{|}~';

const alphabets = {
  SECURE: lowerCase + upperCase + numbers + special,
  SMOL: lowerCase + numbers,
  HEX: '123456789ABCDEF',
}

const passwordOptionsDefault = {
  length: passwordLengthDefault,
  alphabet: alphabets.SECURE,
}

function genPassword(options = passwordOptionsDefault) {
  let pw = "";
  options = {...passwordOptionsDefault, ...options}
  const pwArray = options.alphabet.split('');
  for (let i = 0; i < options.length; i++) {
    pw = pw.concat(pwArray[Math.floor(random() * pwArray.length)]);
  }
  return pw;
}

function Option(label, value) {
  return makeElement({
    tag: "option",
    text: label,
    attributes: {
      label: label,
      value: value, 
    }
  })
}


export class PwGenPage extends Page {
  constructor() {
    super();
  }


  async render() {
    setPageContent("");
    this.passwordBox = CopyableInputBox(genPassword(passwordOptionsDefault));

    this.passwordLengthTitle = makeElement({
      tag: "h4",
      text: this.getPasswordLengthText()
    })

    this.passwordLengthRange = makeElement({
      tag: "input",
      name: "length",
      class: ["uk-range", "uk-width-1-2"],
      attributes: {
        type: "range",
        value: passwordLengthDefault,
        max: passwordLengthMax,
        min: passwordLengthMin,
      },
    })
    this.passwordLengthRange.addEventListener('input', this.updatePassword.bind(this));

    this.passwordAlphabet = makeElement({
      tag: "select",
      class: ["uk-select", "uk-width-1-2"],
      children: [
        Option("a-z a-Z 0-9 specials", alphabets.SECURE),
        Option("a-z 0-9", alphabets.SMOL),
        Option("A-F 1-9", alphabets.HEX),
      ]
    })

    this.passwordForm = makeElement({
      tag: "form",
      children: [
        this.passwordLengthTitle,
        Margin(this.passwordLengthRange),
        Margin(this.passwordAlphabet),
        Margin(this.passwordBox),
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
    this.passwordBox.setText(genPassword({
      length: this.passwordLengthRange.value,
      alphabet: this.passwordAlphabet.value,
    }));
  }

  cleanup() {
    this.passwordBox = undefined;
    this.passwordLengthTitle = undefined;
    this.passwordLengthRange = undefined;
    this.passwordAlphabet = undefined;
    this.passwordForm = undefined;
  }

  get name() {
    return i18next.t("password_generator_title");
  }
}