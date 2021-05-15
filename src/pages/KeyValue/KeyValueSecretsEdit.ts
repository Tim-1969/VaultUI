import { CodeJar } from "codejar";
import { Page } from "../../PageSystem/Page";
import { SecretTitleElement } from "../../elements/SecretTitleElement";
import { createOrUpdateSecret } from "../../api/kv/createOrUpdateSecret";
import { getSecret } from "../../api/kv/getSecret";
import { makeElement } from "../../htmlUtils";
import { setErrorText } from "../../pageUtils";
import { sortedObjectMap, verifyJSONString } from "../../utils";
import i18next from "i18next";

export class KeyValueSecretEditPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("KEY_VALUE_SECRET");
  }
  async render(): Promise<void> {
    const loadingText = makeElement({
      tag: "p",
      text: i18next.t("kv_sec_edit_loading"),
    });
    const editor = makeElement({
      tag: "div",
      class: ["editor", "language-json"],
    });
    const saveButton = makeElement({
      tag: "button",
      class: ["uk-button", "uk-button-primary"],
      text: i18next.t("kv_sec_edit_btn"),
    });
    await this.router.setPageContent(
      makeElement({
        tag: "div",
        children: [
          loadingText,
          editor,
          makeElement({
            tag: "p",
            id: "errorText",
            class: ["uk-text-danger", "uk-margin-top"],
          }),
          saveButton,
        ],
      }),
    );
    const secretInfo = await getSecret(
      this.state.currentBaseMount,
      this.state.currentMountType,
      this.state.currentSecretPath,
      this.state.currentSecret,
    );

    loadingText.remove();

    const secretsJSON = JSON.stringify(sortedObjectMap(secretInfo), null, 4);

    const jar = CodeJar(editor, () => {}, { tab: " ".repeat(4) });
    jar.updateCode(secretsJSON);
    saveButton.onclick = async () => {
      if (!verifyJSONString(jar.toString())) {
        setErrorText(i18next.t("kv_sec_edit_invalid_json_err"));
        return;
      }

      try {
        await createOrUpdateSecret(
          this.state.currentBaseMount,
          this.state.currentMountType,
          this.state.currentSecretPath,
          this.state.currentSecret,
          JSON.parse(jar.toString()),
        );
        await this.router.changePage("KEY_VALUE_SECRET");
      } catch (e: unknown) {
        const error = e as Error;
        setErrorText(error.message);
      }
    };
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router, i18next.t("kv_sec_edit_suffix"));
  }

  get name(): string {
    return i18next.t("kv_sec_edit_title");
  }
}
