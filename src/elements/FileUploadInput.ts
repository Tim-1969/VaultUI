import { makeElement } from "../htmlUtils";
import i18next from "i18next";

export function FileUploadInput(name: string): Element {
  const fileInput = makeElement({
    tag: "input",
    attributes: {
      name: name,
      type: "file",
    },
  });

  const selectInput = makeElement({
    tag: "input",
    class: ["uk-input", "uk-form-width-medium"],
    attributes: {
      type: "text",
      placeholder: i18next.t("file_upload_input_btn"),
    },
  });

  const fileIcon = makeElement({
    tag: "a",
    class: "uk-form-icon",
    attributes: {
      "uk-icon": "icon: upload",
      role: "img",
    },
  });

  return makeElement({
    tag: "div",
    attributes: {
      "uk-form-custom": "target: true",
    },
    children: [fileIcon, fileInput, selectInput],
  });
}
