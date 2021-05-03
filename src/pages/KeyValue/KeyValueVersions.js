import { Page } from "../../types/Page.js";
import { changePage, setPageContent, setTitleElement } from "../../pageUtils.js";
import { getSecretMetadata } from "../../api.js";
import { makeElement } from "../../htmlUtils.js";
import i18next from 'i18next';


export class KeyValueVersionsPage extends Page {
  constructor() {
    super();
  }
  goBack() {
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

    new Map(Object.entries(metadata.versions)).forEach((_, ver) => {
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