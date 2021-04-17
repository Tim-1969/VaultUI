import { Page } from "../../types/Page.js";
import { getSecret, undeleteSecret, getCapabilities } from "../../api.js";
import { setPageContent, setTitleElement } from "../../pageUtils.js";
import { CopyableInputBox } from "../../elements/CopyableInputBox.js";
import { makeElement } from "../../htmlUtils.js";
import Prism from "prismjs";


export class KeyValueSecretsPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    if (pageState.currentSecretVersion != "0") {
      pageState.currentSecretVersion = "0";
      changePage(pages.KEY_VALUE_VERSIONS);

    } else {
      pageState.currentSecret = "";
      changePage(pages.KEY_VALUE_VIEW);
    }

  }
  async render() {
    setTitleElement(pageState);
    setPageContent(makeElement({
      tag: "div",
      children: [
        makeElement({
          tag: "p",
          id: "buttonsBlock"
        }),
        makeElement({
          tag: "p",
          text: "Loading..",
          id: "loadingText"
        }),
        makeElement({
          tag: "div",
          id: "kvList"
        }),
      ]
    }));

    let buttonsBlock = document.querySelector("#buttonsBlock");
    let kvList = document.querySelector("#kvList");
    let isSecretNestedJson = false;
    let caps = await getCapabilities(pageState.currentBaseMount, pageState.currentSecretPath, pageState.currentSecret);
    if (caps.includes("delete")) {
      let deleteButtonText = "Delete";
      if (pageState.currentMountType == "kv-v2" && pageState.currentSecretVersion == "0") {
        deleteButtonText = `Delete All Versions`;
      } else if (pageState.currentMountType == "kv-v2" && pageState.currentSecretVersion != "0") {
        deleteButtonText = `Delete Version ${pageState.currentSecretVersion}`;
      }
      buttonsBlock.appendChild(makeElement({
        tag: "button",
        id: "deleteButton",
        class: ["uk-button", "uk-button-danger"],
        onclick: _ => { changePage(pages.KEY_VALUE_DELETE); },
        text: deleteButtonText
      }));
    }
    if (caps.includes("update")) {
      if (pageState.currentSecretVersion == "0") {
        buttonsBlock.appendChild(makeElement({
          tag: "button",
          id: "editButton",
          class: ["uk-button", "uk-margin", "uk-button-primary"],
          onclick: _ => { changePage(pages.KEY_VALUE_SECRETS_EDIT); },
          text: "Edit"
        }));
      }
    }
    if (pageState.currentMountType == "kv-v2") {
      buttonsBlock.appendChild(makeElement({
        tag: "button",
        id: "versionsButton",
        class: ["uk-button", "uk-button-secondary"],
        onclick: _ => { changePage(pages.KEY_VALUE_VERSIONS); },
        text: "Versions"
      }));
    }

    getSecret(
      pageState.currentBaseMount,
      pageState.currentSecretPath,
      pageState.currentSecret,
      pageState.currentSecretVersion
    ).then(secretInfo => {
      if (secretInfo == null && pageState.currentMountType == "kv-v2") {
        document.querySelector("#buttonsBlock").remove();
        document.getElementById("loadingText").remove();

        kvList.appendChild(makeElement({
          tag: "p",
          text: "This secret version has been soft deleted but remains restorable, do you want to restore it?"
        }));

        kvList.appendChild(makeElement({
          tag: "button",
          text: "Restore Secret Version",
          id: "restoreButton",
          class: ["uk-button", "uk-button-primary"],
          onclick: () => {
            undeleteSecret(
              pageState.currentBaseMount,
              pageState.currentSecretPath,
              pageState.currentSecret,
              pageState.currentSecretVersion
            ).then(resp => {
              changePage(pageState.currentPage);
            });
          },
        }));
        return;
      }

      const secretsMap = new Map(Object.entries(secretInfo).sort());

      for (let [key, value] of secretsMap) {
        if (typeof value == 'object') isSecretNestedJson = true;
      }

      if (isSecretNestedJson) {
        let jsonText = JSON.stringify(Object.fromEntries(secretsMap), null, 4);
        kvList.appendChild(makeElement({
          tag: "pre",
          class: ["code-block", "language-json", "line-numbers"],
          html: Prism.highlight(jsonText, Prism.languages.json, 'json')
        }));
      } else {
        secretsMap.forEach(function (value, key) {
          let kvListElement = this.makeKVListElement(key, value);
          kvList.appendChild(kvListElement);
        }, this);
      }
      document.getElementById("loadingText").remove();
    });
  }
  makeKVListElement(key, value) {
    return makeElement({
      tag: "div",
      class: ["uk-grid", "uk-grid-small", "uk-text-left"],
      children: [CopyableInputBox(key), CopyableInputBox(value)]
    });
  }

  get name() {
    return "K/V Secret";
  }
}