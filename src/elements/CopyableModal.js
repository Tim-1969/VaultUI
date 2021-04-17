import { makeElement } from "../htmlUtils.js";
import ClipboardJS from "clipboard";
import UIkit from 'uikit/dist/js/uikit.min.js';
import FileSaver from 'file-saver';

export function CopyableModal(name, contentString) {
  return makeElement({
    tag: "div",
    class: "modal-sections",
    attributes: {
      "uk-modal": ""
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
            type: "button"
          }
        }),
        makeElement({
          tag: "div",
          class: "uk-modal-header",
          children: makeElement({
            tag: "h2",
            class: "uk-modal-title",
            text: name
          })
        }),
        makeElement({
          tag: "div",
          class: ["uk-modal-body"],
          children: makeElement({
            tag: "pre",
            class: "wrap-pre",
            text: contentString
          })
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
                "data-clipboard-text": contentString
              },
              text: "Download",
              onclick: _ => {
                var blob = new Blob([contentString], {type: "text/plain;charset=utf-8"});
                FileSaver.saveAs(blob, "result.txt");
              }
            }),
            makeElement({
              tag: "button",
              class: ["uk-button", "uk-button-primary"],
              attributes: {
                type: "button",
                "data-clipboard-text": contentString
              },
              text: "Copy",
              thenRun: (e) => {
                let clipboard = new ClipboardJS(e);
                clipboard.on('success', _ => {
                  UIkit.notification("Copied to clipboard.", { status: 'success', timeout: 1000 });
                });
              }
            }),
            makeElement({
              tag: "button",
              class: ["uk-button", "uk-button-secondary", "uk-modal-close"],
              attributes: { type: "button" },
              text: "Close"
            }),

          ]
        }),
      ]
    })
  });
}
