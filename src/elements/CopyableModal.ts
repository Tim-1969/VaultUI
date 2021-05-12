import { addClipboardNotifications } from "../pageUtils";
import { makeElement } from "../htmlUtils";
import ClipboardJS from "clipboard";
import FileSaver from "file-saver";
import UIkit from "uikit";
import i18next from "i18next";

type FileSaverType = {
  saveAs: (blob: Blob, name: string) => void;
};

type ModalType = HTMLElement & {
  show: () => void;
};

export function CopyableModal(name: string, contentString: string): ModalType {
  const modal = makeElement({
    tag: "div",
    class: "modal-sections",
    attributes: {
      "uk-modal": "",
    },
    children: makeElement({
      tag: "div",
      class: "uk-modal-dialog",
      children: [
        makeElement({
          tag: "button",
          class: "uk-modal-close-default",
          attributes: {
            "uk-close": "",
            type: "button",
          },
        }),
        makeElement({
          tag: "div",
          class: "uk-modal-header",
          children: makeElement({
            tag: "h2",
            class: "uk-modal-title",
            text: name,
          }),
        }),
        makeElement({
          tag: "div",
          class: ["uk-modal-body"],
          children: makeElement({
            tag: "pre",
            class: "wrap-pre",
            text: contentString,
          }),
        }),
        makeElement({
          tag: "div",
          class: ["uk-modal-footer", "uk-text-right"],
          children: [
            makeElement({
              tag: "button",
              class: ["uk-button", "uk-button-primary"],
              attributes: {
                type: "button",
                "data-clipboard-text": contentString,
              },
              text: i18next.t("copy_modal_download_btn"),
              onclick: () => {
                const blob = new Blob([contentString], {
                  type: "text/plain;charset=utf-8",
                });
                (FileSaver as FileSaverType).saveAs(blob, "result.txt");
              },
            }),
            makeElement({
              tag: "button",
              class: ["uk-button", "uk-button-primary"],
              attributes: {
                type: "button",
                "data-clipboard-text": contentString,
              },
              text: i18next.t("copy_modal_copy_btn"),
              thenRun: (e) => {
                const clipboard = new ClipboardJS(e);
                addClipboardNotifications(clipboard);
              },
            }),
            makeElement({
              tag: "button",
              class: ["uk-button", "uk-button-secondary", "uk-modal-close"],
              attributes: { type: "button" },
              text: i18next.t("copy_modal_close_btn"),
            }),
          ],
        }),
      ],
    }),
  }) as ModalType;
  modal.show = () => {
    UIkit.modal(modal).show();
  };
  return modal;
}
