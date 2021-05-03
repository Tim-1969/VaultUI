import { MarginInline } from "./MarginInline.js";
import { addClipboardNotifications } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import ClipboardJS from "clipboard";
import i18next from "i18next";

export function CopyableInputBox(text, copyable = true) {
  let inputBoxDiv = makeElement({ tag: "div" });
  let inputBoxCopyButton = null;
  if (copyable) {
    inputBoxCopyButton = makeElement({
      tag: "a",
      class: "uk-form-icon",
      attributes: {
        "uk-icon": "icon: copy",
        "role": "img",
        "aria-label": i18next.t("copy_input_box_copy_icon_text")
      }
    });
    let clipboard = new ClipboardJS(inputBoxCopyButton);
    addClipboardNotifications(clipboard, 600);
  }

  let inputBoxInput = makeElement({
    tag: "input",
    class: ["uk-input"],
    attributes: { "readonly": true, "type": "text" },
  });

  let inputBoxInner = MarginInline([
    inputBoxCopyButton,
    inputBoxInput
  ]);
  inputBoxDiv.appendChild(inputBoxInner);

  inputBoxDiv.setText = function (text) {
    inputBoxInput.value = `${text}`;
    if (copyable) {
      inputBoxCopyButton.dataset.clipboardText = `${text}`;
    }
  };
  inputBoxDiv.setText(text);


  return inputBoxDiv;
}