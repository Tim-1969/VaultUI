import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getSecretMetadata } from "../../../api/kv/getSecretMetadata";
import { objectToMap } from "../../../utils";
import { render } from "preact";
import i18next from "i18next";

export class KeyValueVersionsPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    if (this.state.secretVersion != null) {
      this.state.secretVersion = null;
    }
    await this.router.changePage("KEY_VALUE_SECRET");
  }
  async render(): Promise<void> {
    const metadata = await getSecretMetadata(
      this.state.baseMount,
      this.state.secretPath,
      this.state.secretItem,
    );
    const versions = Array.from(objectToMap(metadata.versions).keys());

    render(
      <ul class="uk-nav uk-nav-default">
        {versions.map((ver) => (
          <li>
            <a
              onClick={async () => {
                this.state.secretVersion = ver;
                await this.router.changePage("KEY_VALUE_SECRET");
              }}
            >
              {`v${ver}`}
            </a>
          </li>
        ))}
      </ul>,
      this.router.pageContentElement,
    );
  }

  async renderPageTitle(): Promise<void> {
    render(
      <SecretTitleElement router={this.router} suffix={i18next.t("kv_sec_versions_suffix")} />,
      this.router.pageTitleElement,
    );
  }

  get name(): string {
    return i18next.t("kv_sec_versions_title");
  }
}
