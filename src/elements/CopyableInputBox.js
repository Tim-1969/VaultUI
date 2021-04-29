import ClipboardJS from "clipboard";
import { addClipboardNotifications } from "../pageUtils.js";
import { makeFormIcon, makeElement } from "../htmlUtils.js";
import { MarginInline } from "./MarginInline.js";

export function CopyableInputBox(text, copyable = true) {
  let inputBoxDiv = makeElement({ tag: "div" });
  let inputBoxCopyButton = null;
  if (copyable) {
    inputBoxCopyButton = makeFormIcon("copy");
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