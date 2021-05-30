import { Component, JSX, render } from "preact";
import { DoesNotExistError } from "../../../types/internalErrors";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getSecrets } from "../../../api/kv/getSecrets";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

export type KVKeysListProps = {
  page: Page;
  baseMount: string;
  secretMountType: string;
  secretPath: string[];
};

type KVKeysListState = {
  dataLoaded: boolean;
  keys: string[];
};

export class KVKeysList extends Component<KVKeysListProps, KVKeysListState> {
  constructor() {
    super();
    this.state = {
      dataLoaded: false,
      keys: [],
    };
  }

  async loadData(): Promise<void> {
    const page = this.props.page;
    try {
      const keys = await getSecrets(
        this.props.baseMount,
        this.props.secretMountType,
        this.props.secretPath,
      );
      this.setState({
        dataLoaded: true,
        keys: keys,
      });
      return;
    } catch (e: unknown) {
      const error = e as Error;
      if (error == DoesNotExistError) {
        // getSecrets also 404's on no keys so dont go all the way back.
        if (this.props.secretPath.length != 0) {
          await page.goBack();
          return;
        }
      } else {
        setErrorText(error.message);
      }
      this.setState({
        dataLoaded: true,
        keys: null,
      });
    }
  }

  componentDidUpdate(prevProps: KVKeysListProps): void {
    if (
      prevProps.baseMount !== this.props.baseMount ||
      prevProps.secretMountType !== this.props.secretMountType ||
      prevProps.secretPath !== this.props.secretPath
    ) {
      this.setState({
        dataLoaded: false,
      });
      void this.loadData();
    }
  }

  componentDidMount(): void {
    void this.loadData();
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
                console.log(secret, page.state.secretPath, page.state.baseMount);

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
    render(
      <>
        <p>
          <button
            class="uk-button uk-button-primary"
            onClick={async () => {
              await this.router.changePage("KEY_VALUE_NEW_SECRET");
            }}
          >
            {i18next.t("kv_view_new_btn")}
          </button>
          {this.state.secretPath.length == 0 && (
            <button
              class="uk-button uk-button-danger"
              onClick={async () => {
                await this.router.changePage("DELETE_SECRET_ENGINE");
              }}
            >
              {i18next.t("kv_view_delete_btn")}
            </button>
          )}
        </p>
        {this.state.secretMountType == "cubbyhole" && <p>{i18next.t("kv_view_cubbyhole_text")}</p>}
        <KVKeysList
          page={this}
          baseMount={this.state.baseMount}
          secretMountType={this.state.secretMountType}
          secretPath={this.state.secretPath}
        />
      </>,
      this.router.pageContentElement,
    );
  }

  async renderPageTitle(): Promise<void> {
    render(<SecretTitleElement page={this} />, this.router.pageTitleElement);
  }

  get name(): string {
    return i18next.t("kv_view_title");
  }
}
