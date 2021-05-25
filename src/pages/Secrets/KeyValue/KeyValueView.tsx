import { Component, JSX, render } from "preact";
import { DoesNotExistError } from "../../../types/internalErrors";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getSecrets } from "../../../api/kv/getSecrets";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

export type KVKeysListProps = {
  page: Page;
};

type KVKeysListState =
  | {
      dataLoaded: false;
    }
  | {
      dataLoaded: true;
      keys: string[];
    };

export class KVKeysList extends Component<KVKeysListProps, KVKeysListState> {
  constructor() {
    super();
    this.state = {
      dataLoaded: false,
    };
  }

  loadData(): void {
    void getSecrets(
      this.props.page.state.baseMount,
      this.props.page.state.secretMountType,
      this.props.page.state.secretPath,
    )
      .then((keys) => {
        this.setState({
          dataLoaded: true,
          keys: keys,
        });
      })
      .catch((e: Error) => {
        // getSecrets also 404's on no keys so dont go all the way back.
        if (e == DoesNotExistError) {
          if (this.props.page.state.secretPath.length != 0) {
            void this.props.page.goBack();
            return;
          } else {
            this.setState({
              dataLoaded: true,
              keys: null,
            });
          }
        } else {
          setErrorText(e.message);
        }
      });
    return;
  }

  componentDidMount(): void {
    if (!this.state.dataLoaded) {
      this.loadData();
    }
  }

  render(): JSX.Element {
    if (!this.state.dataLoaded) {
      return <p>{i18next.t("content_loading")}</p>;
    }
    if (this.state.keys == null) {
      return <p>{i18next.t("kv_view_none_here_text")}</p>;
    }
    return (
      <ul class="uk-nav uk-nav-default">
        {...this.state.keys.map((secret) => (
          <li>
            <a
              onClick={async () => {
                const page = this.props.page;
                if (secret.endsWith("/")) {
                  page.state.pushSecretPath(secret);
                  await page.router.changePage("KEY_VALUE_VIEW");
                } else {
                  page.state.secretItem = secret;
                  await page.router.changePage("KEY_VALUE_SECRET");
                }
              }}
            >
              {secret}
            </a>
          </li>
        ))}
      </ul>
    );
  }
}

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
        <KVKeysList page={this} />
      </>,
      this.router.pageContentElement,
    );
  }

  async renderPageTitle(): Promise<void> {
    render(<SecretTitleElement router={this.router} />, this.router.pageTitleElement);
  }

  get name(): string {
    return i18next.t("kv_view_title");
  }
}
