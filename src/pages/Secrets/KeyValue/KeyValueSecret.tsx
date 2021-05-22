import { CopyableInputBox } from "../../../elements/ReactCopyableInputBox";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getCapabilities } from "../../../api/sys/getCapabilities";
import { getSecret } from "../../../api/kv/getSecret";
import { render } from "preact";
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
    const caps = await getCapabilities(
      this.state.baseMount,
      this.state.secretPath,
      this.state.secretItem,
    );
    render(
      <div>
        <p id="buttonsBlock">
          {
            // Delete Button
            caps.includes("delete") && (
              <button
                class="uk-button uk-button-danger"
                onClick={async () => {
                  await this.router.changePage("KEY_VALUE_DELETE");
                }}
              >
                {((): string => {
                  let deleteButtonText = i18next.t("kv_secret_delete_btn");
                  if (this.state.secretMountType == "kv-v2" && this.state.secretVersion == null) {
                    deleteButtonText = i18next.t("kv_secret_delete_all_btn");
                  } else if (
                    this.state.secretMountType == "kv-v2" &&
                    this.state.secretVersion != null
                  ) {
                    deleteButtonText = i18next.t("kv_secret_delete_version_btn", {
                      version: this.state.secretVersion,
                    });
                  }
                  return deleteButtonText;
                })()}
              </button>
            )
          }
          {caps.includes("update") && this.state.secretVersion == null && (
            <button
              class="uk-button uk-button-primary"
              onClick={async () => {
                await this.router.changePage("KEY_VALUE_SECRET_EDIT");
              }}
            >
              {i18next.t("kv_secret_edit_btn")}
            </button>
          )}
          {this.state.secretMountType == "kv-v2" && (
            <button
              class="uk-button uk-button-secondary"
              onClick={async () => {
                await this.router.changePage("KEY_VALUE_VERSIONS");
              }}
            >
              {i18next.t("kv_secret_versions_btn")}
            </button>
          )}
        </p>
        <p id="loadingText">{i18next.t("kv_secret_loading")}</p>
        <div id="kvList"></div>
      </div>,
      this.router.pageContentElement,
    );

    const kvList = document.querySelector("#kvList");
    let isSecretNestedJson = false;

    const secretInfo = await getSecret(
      this.state.baseMount,
      this.state.secretMountType,
      this.state.secretPath,
      this.state.secretItem,
      this.state.secretVersion,
    );

    // On kv-v2, secrets can be deleted temporarily with the ability to restore
    if (secretInfo == null && this.state.secretMountType == "kv-v2") {
      try {
        document.querySelector("#buttonsBlock").remove();
        document.getElementById("loadingText").remove();
      } catch (_) {
        // Do Nothing
      }
      render(
        <>
          <p>{i18next.t("kv_secret_deleted_text")}</p>
          <button
            class="uk-button uk-button-primary"
            onClick={async () => {
              await undeleteSecret(
                this.state.baseMount,
                this.state.secretPath,
                this.state.secretItem,
                this.state.secretVersion,
              );
              await this.router.refresh();
            }}
          >
            {i18next.t("kv_secret_restore_btn")}
          </button>
        </>,
        kvList,
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
      const highlightedJson = Prism.highlight(jsonText, Prism.languages.json, "json");
      render(
        <pre
          class="code-block language-json line-numbers"
          dangerouslySetInnerHTML={{ __html: highlightedJson }}
        />,
        kvList,
      );
    } else {
      render(
        <>
          {Array.from(secretsMap).map((data: [string, string]) => (
            <div class="uk-grid uk-grid-small uk-text-left" uk-grid>
              <CopyableInputBox text={data[0]} copyable />
              <CopyableInputBox text={data[1]} copyable />
            </div>
          ))}
        </>,
        kvList,
      );
    }
    document.getElementById("loadingText").remove();
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router);
  }

  get name(): string {
    return i18next.t("kv_secret_title");
  }
}
