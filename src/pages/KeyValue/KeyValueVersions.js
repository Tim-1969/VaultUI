import { Page } from "../../types/Page";
import { changePage, setPageContent, setTitleElement } from "../../pageUtils";
import { getSecretMetadata } from "../../api/getSecretMetadata.js";
import { makeElement } from "../../htmlUtils";
import { objectToMap } from "../../utils";
import { pageState } from "../../globalPageState.ts";
import i18next from 'i18next';


export class KeyValueVersionsPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    if (pageState.currentSecretVersion != null) {
      pageState.currentSecretVersion = null;
    }
    changePage("KEY_VALUE_SECRET");
  }
  async render() {
    setTitleElement(pageState);

    let versionsList = makeElement({
      tag: "ul",
      id: "versionsList",
      class: ["uk-nav", "uk-nav-default"]
    });
    setPageContent(versionsList);

    let metadata = await getSecretMetadata(
      pageState.currentBaseMount,
      pageState.currentSecretPath,
      pageState.currentSecret
    );

    objectToMap(metadata.versions).forEach((_, ver) => {
      versionsList.appendChild(makeElement({
        tag: "li",
        children: makeElement({
          tag: "a",
          text: `v${ver}`,
          onclick: _ => {
            pageState.currentSecretVersion = ver;
            changePage("KEY_VALUE_SECRET");
          }
        })
      }));
    });
  }

  get titleSuffix() {
    return i18next.t("kv_sec_versions_suffix");
  }

  get name() {
    return i18next.t("kv_sec_versions_title");
  }
}