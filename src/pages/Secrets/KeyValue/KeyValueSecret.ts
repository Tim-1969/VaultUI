import { CopyableInputBox } from "../../../elements/CopyableInputBox";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getCapabilities } from "../../../api/sys/getCapabilities";
import { getSecret } from "../../../api/kv/getSecret";
import { makeElement } from "z-makeelement";
import { sortedObjectMap } from "../../../utils";
import { undeleteSecret } from "../../../api/kv/undeleteSecret";
import Prism from "prismjs";
import i18next from "i18next";

export class KeyValueSecretPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    if (this.state.secretVersion != null) {
      this.state.secretVersion = null;
      await this.router.changePage("KEY_VALUE_VERSIONS");
    } else {
      this.state.secretItem = "";
      await this.router.changePage("KEY_VALUE_VIEW");
    }
  }
  async render(): Promise<void> {
    await this.router.setPageContent(
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
      this.state.baseMount,
      this.state.secretPath,
      this.state.secretItem,
    );
    if (caps.includes("delete")) {
      let deleteButtonText = i18next.t("kv_secret_delete_btn");
      if (this.state.secretMountType == "kv-v2" && this.state.secretVersion == null) {
        deleteButtonText = i18next.t("kv_secret_delete_all_btn");
      } else if (this.state.secretMountType == "kv-v2" && this.state.secretVersion != null) {
        deleteButtonText = i18next.t("kv_secret_delete_version_btn", {
          version: this.state.secretVersion,
        });
      }
      buttonsBlock.appendChild(
        makeElement({
          tag: "button",
          id: "deleteButton",
          class: ["uk-button", "uk-button-danger"],
          onclick: async () => {
            await this.router.changePage("KEY_VALUE_DELETE");
          },
          text: deleteButtonText,
        }),
      );
    }
    if (caps.includes("update")) {
      if (this.state.secretVersion == null) {
        buttonsBlock.appendChild(
          makeElement({
            tag: "button",
            id: "editButton",
            class: ["uk-button", "uk-margin", "uk-button-primary"],
            onclick: async () => {
              await this.router.changePage("KEY_VALUE_SECRET_EDIT");
            },
            text: i18next.t("kv_secret_edit_btn"),
          }),
        );
      }
    }
    if (this.state.secretMountType == "kv-v2") {
      buttonsBlock.appendChild(
        makeElement({
          tag: "button",
          id: "versionsButton",
          class: ["uk-button", "uk-button-secondary"],
          onclick: async () => {
            await this.router.changePage("KEY_VALUE_VERSIONS");
          },
          text: i18next.t("kv_secret_versions_btn"),
        }),
      );
    }

    const secretInfo = await getSecret(
      this.state.baseMount,
      this.state.secretMountType,
      this.state.secretPath,
      this.state.secretItem,
      this.state.secretVersion,
    );

    if (secretInfo == null && this.state.secretMountType == "kv-v2") {
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
          onclick: async () => {
            await undeleteSecret(
              this.state.baseMount,
              this.state.secretPath,
              this.state.secretItem,
              this.state.secretVersion,
            );
            await this.router.refresh();
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
  }
  makeKVListElement(key: string, value: string): HTMLElement {
    return makeElement({
      tag: "div",
      class: ["uk-grid", "uk-grid-small", "uk-text-left"],
      children: [CopyableInputBox(key), CopyableInputBox(value)],
    });
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router);
  }

  get name(): string {
    return i18next.t("kv_secret_title");
  }
}
