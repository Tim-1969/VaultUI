import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getSecretMetadata } from "../../../api/kv/getSecretMetadata";
import { makeElement } from "z-makeelement";
import { objectToMap } from "../../../utils";
import i18next from "i18next";

export class KeyValueVersionsPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    if (this.state.currentSecretVersion != null) {
      this.state.currentSecretVersion = null;
    }
    await this.router.changePage("KEY_VALUE_SECRET");
  }
  async render(): Promise<void> {
    const versionsList = makeElement({
      tag: "ul",
      id: "versionsList",
      class: ["uk-nav", "uk-nav-default"],
    });
    await this.router.setPageContent(versionsList);

    const metadata = await getSecretMetadata(
      this.state.currentBaseMount,
      this.state.currentSecretPath,
      this.state.currentSecret,
    );

    objectToMap(metadata.versions).forEach((_, ver) => {
      versionsList.appendChild(
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "a",
            text: `v${ver}`,
            onclick: async () => {
              this.state.currentSecretVersion = ver;
              await this.router.changePage("KEY_VALUE_SECRET");
            },
          }),
        }),
      );
    });
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router, i18next.t("kv_sec_versions_suffix"));
  }

  get name(): string {
    return i18next.t("kv_sec_versions_title");
  }
}
