import { MarginInline } from "./MarginInline";
import { addClipboardNotifications } from "../pageUtils";
import { makeElement } from "../htmlUtils";
import ClipboardJS from "clipboard";
import i18next from "i18next";

export interface CopyableInputBoxType extends HTMLElement {
  setText(text: string): void;
}

export function CopyableInputBox(text: string, copyable = true): CopyableInputBoxType {
  const inputBoxDiv = (makeElement({ tag: "div" }) as CopyableInputBoxType);
  let inputBoxCopyButton: HTMLElement = null;
  if (copyable) {
    inputBoxCopyButton = makeElement({
      tag: "a",
      class: "uk-form-icon",
      attributes: {
        "uk-icon": "icon: copy",
        "role": "img",
        "aria-label": i18next.t("copy_input_box_copy_icon_text")
      },
      thenRun: (e) => {
        const clipboard = new ClipboardJS(e);
        addClipboardNotifications(clipboard, 600);
      }
    });
  }

  const inputBoxInput = makeElement({
    tag: "input",
    class: ["uk-input", "uk-input-copyable"],
    attributes: { "readonly": "true", "type": "text" },
  }) as HTMLInputElement;

  const inputBoxInner = MarginInline([
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