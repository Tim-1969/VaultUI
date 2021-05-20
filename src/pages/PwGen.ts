import { CopyableInputBox, CopyableInputBoxType } from "../elements/CopyableInputBox";
import { Form } from "../elements/Form";
import { Margin } from "../elements/Margin";
import { Option } from "../elements/Option";
import { Page } from "../types/Page";
import { makeElement } from "z-makeelement";
import i18next from "i18next";

const passwordLengthMin = 1;
const passwordLengthMax = 64;
const passwordLengthDefault = 24;

function random() {
  if (
    typeof window.crypto?.getRandomValues === "function" &&
    typeof window.Uint32Array === "function"
  ) {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
  }

  return Math.random();
}

const lowerCase = "abcdefghijklmnopqrstuvwxyz";
const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "1234567890";
const special = "!#$%&()*+,-./:;<=>?@[]^_{|}~";

const alphabets = {
  SECURE: lowerCase + upperCase + numbers + special,
  SMOL: lowerCase + numbers,
  HEX: "123456789ABCDEF",
};

const passwordOptionsDefault = {
  length: passwordLengthDefault,
  alphabet: alphabets.SECURE,
};

function genPassword(options = passwordOptionsDefault) {
  let pw = "";
  options = { ...passwordOptionsDefault, ...options };
  const pwArray = options.alphabet.split("");
  for (let i = 0; i < options.length; i++) {
    pw = pw.concat(pwArray[Math.floor(random() * pwArray.length)]);
  }
  return pw;
}

export class PwGenPage extends Page {
  constructor() {
    super();
  }

  passwordBox: CopyableInputBoxType;
  passwordLengthTitle: HTMLTitleElement;
  passwordLengthRange: HTMLInputElement;
  passwordAlphabet: HTMLSelectElement;
  passwordForm: HTMLFormElement;

  async render(): Promise<void> {
    await this.router.setPageContent("");
    this.passwordBox = CopyableInputBox(genPassword(passwordOptionsDefault));

    this.passwordLengthTitle = makeElement({
      tag: "h4",
      text: this.getPasswordLengthText(),
    }) as HTMLTitleElement;

    this.passwordLengthRange = makeElement({
      tag: "input",
      name: "length",
      class: ["uk-range", "uk-width-1-2"],
      attributes: {
        type: "range",
        value: passwordLengthDefault.toString(),
        max: passwordLengthMax.toString(),
        min: passwordLengthMin.toString(),
      },
    }) as HTMLInputElement;

    this.passwordLengthRange.addEventListener("input", this.updatePassword.bind(this));

    this.passwordAlphabet = makeElement({
      tag: "select",
      class: ["uk-select", "uk-width-1-2"],
      children: [
        Option("a-z a-Z 0-9 specials", alphabets.SECURE),
        Option("a-z 0-9", alphabets.SMOL),
        Option("A-F 1-9", alphabets.HEX),
      ],
    }) as HTMLSelectElement;

    this.passwordForm = Form(
      [
        this.passwordLengthTitle,
        Margin(this.passwordLengthRange),
        Margin(this.passwordAlphabet),
        Margin(this.passwordBox),
        Margin(
          makeElement({
            tag: "button",
            text: i18next.t("gen_password_btn"),
            class: ["uk-button", "uk-button-primary", "uk-margin-bottom"],
            attributes: { type: "submit" },
          }),
        ),
      ],
      (_) => this.updatePassword(),
    );
    await this.router.setPageContent(this.passwordForm);
  }

  getPasswordLengthText(): string {
    return i18next.t("password_length_title", {
      min: this?.passwordLengthRange?.value || 24,
      max: passwordLengthMax,
    });
  }

  updatePassword(): void {
    this.passwordLengthTitle.innerText = this.getPasswordLengthText();
    this.passwordBox.setText(
      genPassword({
        length: this.passwordLengthRange.value as unknown as number,
        alphabet: this.passwordAlphabet.value,
      }),
    );
  }

  async cleanup(): Promise<void> {
    this.passwordBox = undefined;
    this.passwordLengthTitle = undefined;
    this.passwordLengthRange = undefined;
    this.passwordAlphabet = undefined;
    this.passwordForm = undefined;
  }

  get name(): string {
    return i18next.t("password_generator_title");
  }
}
