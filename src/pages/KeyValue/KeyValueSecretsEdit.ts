import { CodeJar } from "codejar";
import { Page } from "../../types/Page";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { createOrUpdateSecret } from "../../api/kv/createOrUpdateSecret";
import { getSecret } from "../../api/kv/getSecret";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import { sortedObjectMap, verifyJSONString } from "../../utils";
import i18next from "i18next";

export class KeyValueSecretEditPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await changePage("KEY_VALUE_SECRET");
  }
  async render(): Promise<void> {
    setTitleElement(pageState);
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
    setPageContent(
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
    void getSecret(
      pageState.currentBaseMount,
      pageState.currentMountType,
      pageState.currentSecretPath,
      pageState.currentSecret,
    ).then((secretInfo) => {
      loadingText.remove();

      const secretsJSON = JSON.stringify(sortedObjectMap(secretInfo), null, 4);

      const jar = CodeJar(editor, () => {}, { tab: " ".repeat(4) });
      jar.updateCode(secretsJSON);
      saveButton.onclick = function () {
        if (!verifyJSONString(jar.toString())) {
          setErrorText(i18next.t("kv_sec_edit_invalid_json_err"));
          return;
        }

        createOrUpdateSecret(
          pageState.currentBaseMount,
          pageState.currentMountType,
          pageState.currentSecretPath,
          pageState.currentSecret,
          JSON.parse(jar.toString()),
        )
          .then((_) => {
            void changePage("KEY_VALUE_SECRET");
            return;
          })
          .catch((e: Error) => {
            setErrorText(e.message);
          });
      };
    });
  }

  get titleSuffix(): string {
    return i18next.t("kv_sec_edit_suffix");
  }

  get name(): string {
    return i18next.t("kv_sec_edit_title");
  }
}
