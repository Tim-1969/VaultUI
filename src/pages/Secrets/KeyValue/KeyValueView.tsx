import { DoesNotExistError } from "../../../types/internalErrors";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getSecrets } from "../../../api/kv/getSecrets";
import { render } from "preact";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

export class KeyValueViewPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    if (this.state.secretPath.length != 0) {
      this.state.popSecretPath();
      await this.router.changePage("KEY_VALUE_VIEW");
    } else {
      await this.router.changePage("SECRETS_HOME");
    }
  }
  async render(): Promise<void> {
    this.state.secretItem = "";

    render(
      <>
        <div id="buttonsBox">
          <button
            class="uk-button uk-button-primary uk-margin-bottom"
            onClick={async () => {
              await this.router.changePage("KEY_VALUE_NEW_SECRET");
            }}
          >
            {i18next.t("kv_view_new_btn")}
          </button>
        </div>
        {this.state.secretMountType == "cubbyhole" && <p>{i18next.t("kv_view_cubbyhole_text")}</p>}
        <div id="secretsList" />
      </>,
      this.router.pageContentElement,
    );

    let res: string[];

    try {
      res = await getSecrets(
        this.state.baseMount,
        this.state.secretMountType,
        this.state.secretPath,
      );
    } catch (e: unknown) {
      const error = e as Error;
      if (error == DoesNotExistError) {
        // getSecrets also 404's on no keys so dont go all the way back.
        if (this.state.secretPath.length != 0) {
          return this.goBack();
        } else {
          render(
            <p>{i18next.t("kv_view_none_here_text")}</p>,
            document.querySelector("#secretsList"),
          );
        }
      } else {
        setErrorText(error.message);
        return;
      }
    }

    render(
      <ul class="uk-nav uk-nav-default">
        {...res.map((secret) => (
          <li>
            <a
              onClick={async () => {
                if (secret.endsWith("/")) {
                  this.state.pushSecretPath(secret);
                  await this.router.changePage("KEY_VALUE_VIEW");
                } else {
                  this.state.secretItem = secret;
                  await this.router.changePage("KEY_VALUE_SECRET");
                }
              }}
            >
              {secret}
            </a>
          </li>
        ))}
      </ul>,
      document.querySelector("#secretsList"),
    );
  }

  async renderPageTitle(): Promise<void> {
    render(<SecretTitleElement router={this.router} />, this.router.pageTitleElement);
  }

  get name(): string {
    return i18next.t("kv_view_title");
  }
}
