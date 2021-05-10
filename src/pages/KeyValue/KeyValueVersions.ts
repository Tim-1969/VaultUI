import { Page } from "../../types/Page";
import { changePage, setPageContent, setTitleElement } from "../../pageUtils";
import { getSecretMetadata } from "../../api/kv/getSecretMetadata";
import { makeElement } from "../../htmlUtils";
import { objectToMap } from "../../utils";
import { pageState } from "../../globalPageState";
import i18next from 'i18next';


export class KeyValueVersionsPage extends Page {
  constructor() {
    super();
  }
  goBack(): void {
    if (pageState.currentSecretVersion != null) {
      pageState.currentSecretVersion = null;
    }
    changePage("KEY_VALUE_SECRET");
  }
  async render(): Promise<void> {
    setTitleElement(pageState);

    const versionsList = makeElement({
      tag: "ul",
      id: "versionsList",
      class: ["uk-nav", "uk-nav-default"]
    });
    setPageContent(versionsList);

    const metadata = await getSecretMetadata(
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
          onclick: () => {
            pageState.currentSecretVersion = ver;
            changePage("KEY_VALUE_SECRET");
          }
        })
      }));
    });
  }

  get titleSuffix(): string {
    return i18next.t("kv_sec_versions_suffix");
  }

  get name(): string {
    return i18next.t("kv_sec_versions_title");
  }
}