import { CopyableInputBox } from "../../elements/CopyableInputBox";
import { Page } from "../../types/Page";
import { changePage, setPageContent, setTitleElement } from "../../pageUtils";
import { getCapabilities } from "../../api/sys/getCapabilities";
import { getSecret } from "../../api/kv/getSecret";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import { sortedObjectMap } from "../../utils";
import { undeleteSecret } from "../../api/kv/undeleteSecret";
import Prism from "prismjs";
import i18next from "i18next";

export class KeyValueSecretPage extends Page {
  constructor() {
    super();
  }
  goBack(): void {
    if (pageState.currentSecretVersion != null) {
      pageState.currentSecretVersion = null;
      changePage("KEY_VALUE_VERSIONS");
    } else {
      pageState.currentSecret = "";
      changePage("KEY_VALUE_VIEW");
    }
  }
  async render(): Promise<void> {
    setTitleElement(pageState);
    setPageContent(
      makeElement({
        tag: "div",
        children: [
          makeElement({
            tag: "p",
            id: "buttonsBlock",
          }),
          makeElement({
            tag: "p",
            text: i18next.t("kv_secret_loading"),
            id: "loadingText",
          }),
          makeElement({
            tag: "div",
            id: "kvList",
          }),
        ],
      }),
    );

    const buttonsBlock = document.querySelector("#buttonsBlock");
    const kvList = document.querySelector("#kvList");
    let isSecretNestedJson = false;
    const caps = await getCapabilities(
      pageState.currentBaseMount,
      pageState.currentSecretPath,
      pageState.currentSecret,
    );
    if (caps.includes("delete")) {
      let deleteButtonText = i18next.t("kv_secret_delete_btn");
      if (pageState.currentMountType == "kv-v2" && pageState.currentSecretVersion == null) {
        deleteButtonText = i18next.t("kv_secret_delete_all_btn");
      } else if (pageState.currentMountType == "kv-v2" && pageState.currentSecretVersion != null) {
        deleteButtonText = i18next.t("kv_secret_delete_version_btn", {
          version: pageState.currentSecretVersion,
        });
      }
      buttonsBlock.appendChild(
        makeElement({
          tag: "button",
          id: "deleteButton",
          class: ["uk-button", "uk-button-danger"],
          onclick: () => {
            changePage("KEY_VALUE_DELETE");
          },
          text: deleteButtonText,
        }),
      );
    }
    if (caps.includes("update")) {
      if (pageState.currentSecretVersion == null) {
        buttonsBlock.appendChild(
          makeElement({
            tag: "button",
            id: "editButton",
            class: ["uk-button", "uk-margin", "uk-button-primary"],
            onclick: () => {
              changePage("KEY_VALUE_SECRET_EDIT");
            },
            text: i18next.t("kv_secret_edit_btn"),
          }),
        );
      }
    }
    if (pageState.currentMountType == "kv-v2") {
      buttonsBlock.appendChild(
        makeElement({
          tag: "button",
          id: "versionsButton",
          class: ["uk-button", "uk-button-secondary"],
          onclick: () => {
            changePage("KEY_VALUE_VERSIONS");
          },
          text: i18next.t("kv_secret_versions_btn"),
        }),
      );
    }

    void getSecret(
      pageState.currentBaseMount,
      pageState.currentMountType,
      pageState.currentSecretPath,
      pageState.currentSecret,
      pageState.currentSecretVersion,
    ).then((secretInfo) => {
      if (secretInfo == null && pageState.currentMountType == "kv-v2") {
        document.querySelector("#buttonsBlock").remove();
        document.getElementById("loadingText").remove();

        kvList.appendChild(
          makeElement({
            tag: "p",
            text: i18next.t("kv_secret_deleted_text"),
          }),
        );

        kvList.appendChild(
          makeElement({
            tag: "button",
            text: i18next.t("kv_secret_restore_btn"),
            id: "restoreButton",
            class: ["uk-button", "uk-button-primary"],
            onclick: () => {
              void undeleteSecret(
                pageState.currentBaseMount,
                pageState.currentSecretPath,
                pageState.currentSecret,
                pageState.currentSecretVersion,
              ).then((_) => {
                changePage(pageState.currentPageString);
              });
            },
          }),
        );
        return;
      }

      const secretsMap = sortedObjectMap(secretInfo);

      for (const value of secretsMap.values()) {
        if (typeof value == "object") isSecretNestedJson = true;
      }

      if (isSecretNestedJson) {
        const jsonText = JSON.stringify(
          sortedObjectMap(secretsMap as unknown as Record<string, unknown>),
          null,
          4,
        );
        kvList.appendChild(
          makeElement({
            tag: "pre",
            class: ["code-block", "language-json", "line-numbers"],
            html: Prism.highlight(jsonText, Prism.languages.json, "json"),
          }),
        );
      } else {
        secretsMap.forEach((value: string, key: string) => {
          const kvListElement = this.makeKVListElement(key, value);
          kvList.appendChild(kvListElement);
        }, this);
      }
      document.getElementById("loadingText").remove();
    });
  }
  makeKVListElement(key: string, value: string): HTMLElement {
    return makeElement({
      tag: "div",
      class: ["uk-grid", "uk-grid-small", "uk-text-left"],
      children: [CopyableInputBox(key), CopyableInputBox(value)],
    });
  }

  get name(): string {
    return i18next.t("kv_secret_title");
  }
}
