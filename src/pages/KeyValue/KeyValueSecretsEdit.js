import { Page } from "../../types/Page.js";
import { getSecret, createOrUpdateSecret } from "../../api.js";
import { verifyJSONString } from "../../utils.js";
import { setPageContent, setTitleElement, setErrorText, changePage } from "../../pageUtils.js";
import { makeElement } from "../../htmlUtils.js";
import { CodeJar } from "codejar";

export class KeyValueSecretsEditPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage("KEY_VALUE_SECRETS");
  }
  render() {
    setTitleElement(pageState);
    let loadingText = makeElement({ tag: "p", text: "Loading.." });
    let editor = makeElement({
      tag: "div",
      class: ["editor", "language-json"]
    });
    let saveButton = makeElement({
      tag: "button",
      class: ["uk-button", "uk-button-primary"],
      text: "Save"
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
    getSecret(pageState.currentBaseMount, pageState.currentSecretPath, pageState.currentSecret).then(secretInfo => {
      loadingText.remove();

      const secretsJSON = JSON.stringify(Object.fromEntries(new Map(Object.entries(secretInfo).sort())), null, 4);

      let jar = CodeJar(editor, () => { }, { tab: ' '.repeat(4) });
      jar.updateCode(secretsJSON);
      saveButton.onclick = function () {
        if (!verifyJSONString(jar.toString())) {
          setErrorText("Invalid JSON");
          return;
        }
        createOrUpdateSecret(
          pageState.currentBaseMount,
          pageState.currentSecretPath,
          pageState.currentSecret,
          JSON.parse(jar.toString())
        ).then(_ => {
          changePage("KEY_VALUE_SECRETS");
          return;
        }).catch(e => {
          setErrorText(e.message);
        });
      };
    });
  }

  get titlePrefix() {
    return " (edit)";
  }

  get name() {
    return "K/V Secrets Edit";
  }
}