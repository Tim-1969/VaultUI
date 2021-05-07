import { CodeJar } from "codejar";
import { Page } from "../../types/Page.js";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils.js";
import { createOrUpdateSecret } from "../../api/createOrUpdateSecret.js";
import { getSecret } from "../../api/getSecret.js";
import { makeElement } from "../../htmlUtils.js";
import { pageState } from "../../globalPageState.js";
import { verifyJSONString } from "../../utils.js";
import i18next from 'i18next';

export class KeyValueSecretEditPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage("KEY_VALUE_SECRET");
  }
  render() {
    setTitleElement(pageState);
    let loadingText = makeElement({
      tag: "p",
      text: i18next.t("kv_sec_edit_loading")
    });
    let editor = makeElement({
      tag: "div",
      class: ["editor", "language-json"]
    });
    let saveButton = makeElement({
      tag: "button",
      class: ["uk-button", "uk-button-primary"],
      text: i18next.t("kv_sec_edit_btn")
    });
    setPageContent(makeElement({
      tag: "div",
      children: [
        loadingText,
        editor,
        makeElement({
          tag: "p",
          id: "errorText",
          class: ["uk-text-danger", "uk-margin-top"]
        }),
        saveButton
      ]
    }));
    getSecret(
      pageState.currentBaseMount,
      pageState.currentMountType,
      pageState.currentSecretPath,
      pageState.currentSecret,
    ).then(secretInfo => {
      loadingText.remove();

      const secretsJSON = JSON.stringify(Object.fromEntries(new Map(Object.entries(secretInfo).sort())), null, 4);

      let jar = CodeJar(editor, () => { }, { tab: ' '.repeat(4) });
      jar.updateCode(secretsJSON);
      saveButton.onclick = function () {
        if (!verifyJSONString(jar.toString())) {
          setErrorText(i18next.t("kv_sec_edit_invalid_json_err"));
          return;
        }
        createOrUpdateSecret(
          pageState.currentBaseMount,
          pageState.currentSecretPath,
          pageState.currentSecret,
          JSON.parse(jar.toString())
        ).then(_ => {
          changePage("KEY_VALUE_SECRET");
          return;
        }).catch(e => {
          setErrorText(e.message);
        });
      };
    });
  }

  get titleSuffix() {
    return i18next.t("kv_sec_edit_suffix");
  }

  get name() {
    return i18next.t("kv_sec_edit_title");
  }
}