import { Component, JSX, render } from "preact";
import { CopyableInputBox } from "../../../elements/CopyableInputBox";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getCapabilities } from "../../../api/sys/getCapabilities";
import { getSecret } from "../../../api/kv/getSecret";
import { sortedObjectMap } from "../../../utils";
import { undeleteSecret } from "../../../api/kv/undeleteSecret";
import Prism from "prismjs";
import i18next from "i18next";

export type KVSecretViewProps = {
  kvData: Record<string, unknown>;
};

export class KVSecretVew extends Component<KVSecretViewProps, unknown> {
  render(): JSX.Element {
    const secretsMap = sortedObjectMap(this.props.kvData);
    let isMultiLevelJSON = false;

    for (const value of secretsMap.values()) {
      if (typeof value == "object") isMultiLevelJSON = true;
    }

    if (isMultiLevelJSON) {
      const jsonText = JSON.stringify(Object.fromEntries(secretsMap), null, 4);
      const highlightedJson = Prism.highlight(jsonText, Prism.languages.json, "json");
      return (
        <pre
          class="code-block language-json line-numbers"
          dangerouslySetInnerHTML={{ __html: highlightedJson }}
        />
      );
    } else {
      return (
        <>
          {Array.from(secretsMap).map((data: [string, string]) => (
            <div class="uk-grid uk-grid-small uk-text-left" uk-grid>
              <CopyableInputBox text={data[0]} copyable />
              <CopyableInputBox text={data[1]} copyable />
            </div>
          ))}
        </>
      );
    }
  }
}

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

    const secretInfo = await getSecret(
      this.state.baseMount,
      this.state.secretMountType,
      this.state.secretPath,
      this.state.secretItem,
      this.state.secretVersion,
    );

    // On kv-v2, secrets can be deleted temporarily with the ability to restore
    // Do not show any buttons when the secret is deleted.
    const secretIsDeleted = secretInfo == null && this.state.secretMountType == "kv-v2";

    render(
      <div>
        <p id="buttonsBlock">
          {
            // Delete Button
            !secretIsDeleted && caps.includes("delete") && (
              <button
                class="uk-button uk-button-danger"
                onClick={async () => {
                  await this.router.changePage("KEY_VALUE_DELETE");
                }}
              >
                {((): string => {
                  // Delete Secret on kv-v1
                  let deleteButtonText = i18next.t("kv_secret_delete_btn");
                  if (this.state.secretMountType == "kv-v2" && this.state.secretVersion == null) {
                    // Delete All
                    deleteButtonText = i18next.t("kv_secret_delete_all_btn");
                  } else if (
                    this.state.secretMountType == "kv-v2" &&
                    this.state.secretVersion != null
                  ) {
                    // Delete Version X
                    deleteButtonText = i18next.t("kv_secret_delete_version_btn", {
                      version: this.state.secretVersion,
                    });
                  }
                  return deleteButtonText;
                })()}
              </button>
            )
          }
          {!secretIsDeleted && caps.includes("update") && this.state.secretVersion == null && (
            <button
              class="uk-button uk-button-primary"
              onClick={async () => {
                await this.router.changePage("KEY_VALUE_SECRET_EDIT");
              }}
            >
              {i18next.t("kv_secret_edit_btn")}
            </button>
          )}
          {!secretIsDeleted && this.state.secretMountType == "kv-v2" && (
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

        {!secretIsDeleted && <KVSecretVew kvData={secretInfo} />}

        {secretIsDeleted && (
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
          </>
        )}
      </div>,
      this.router.pageContentElement,
    );
  }

  async renderPageTitle(): Promise<void> {
    render(<SecretTitleElement router={this.router} />, this.router.pageTitleElement);
  }

  get name(): string {
    return i18next.t("kv_secret_title");
  }
}
