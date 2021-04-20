import { Page } from "../types/Page.js";
import { setPageContent } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import { CopyableInputBox } from "../elements/CopyableInputBox.js";
import i18next from 'i18next';


function random() {
  const {
    crypto,
    Uint32Array
  } = window;

  if (typeof (crypto === null || crypto === void 0 ? void 0 : crypto.getRandomValues) === 'function' && typeof Uint32Array === 'function') {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
  }

  return Math.random();
}


function genPw(len) {
  let pw = "";
  const pwArray = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'()*+,-./:;<=>?@[]^_{|}~".split('');
  for (let i = 0; i < len; i++) {
    pw = pw.concat(pwArray[Math.floor(random() * pwArray.length)]);
  }
  return pw;
}


export class PwGenPage extends Page {
  constructor() {
    super();
  }
  async render() {
    let inputBox = CopyableInputBox(genPw(24));
    setPageContent(makeElement({
      tag: "div",
      children: [
        inputBox,
        makeElement({
          tag: "button",
          text: i18next.t("gen_password_btn"),
          class: ["uk-button", "uk-button-primary", "uk-margin-bottom"],
          onclick: () => {
            inputBox.setText(genPw(24));
          }
        })
      ]
    }));
  }

  get name() {
    return i18next.t("password_generator_title");
  }
}