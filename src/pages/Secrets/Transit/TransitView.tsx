import { Component, JSX, render } from "preact";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getTransitKeys } from "../../../api/transit/getTransitKeys";
import i18next from "i18next";

type TransitViewListState = {
  contentLoaded: boolean;
  transitKeysList: string[];
};

export class TransitViewListItem extends Component<{ page: Page }, TransitViewListState> {
  constructor() {
    super();
    this.state = {
      contentLoaded: false,
      transitKeysList: [],
    };
  }

  timer: unknown;

  getTransitKeys(): void {
    void getTransitKeys(this.props.page.state.baseMount)
      .then((keys) => {
        this.setState({
          contentLoaded: true,
          transitKeysList: keys,
        });
      })
      .catch((_) => {
        this.setState({
          contentLoaded: true,
          transitKeysList: [],
        });
      });
  }

  componentDidMount(): void {
    this.getTransitKeys();
  }

  render(): JSX.Element {
    if (!this.state.contentLoaded) {
      return <p>{i18next.t("content_loading")}</p>;
    }

    if (this.state.transitKeysList.length == 0) {
      return <p>{i18next.t("transit_view_none_here_text")}</p>;
    }

    return (
      <ul class="uk-nav uk-nav-default">
        {...this.state.transitKeysList.map((key) => (
          <li>
            <a
              onClick={async () => {
                this.props.page.state.secretItem = key;
                await this.props.page.router.changePage("TRANSIT_VIEW_SECRET");
              }}
            >
              {key}
            </a>
          </li>
        ))}
      </ul>
    );
  }
}

export class TransitViewPage extends Page {
  constructor() {
    super();
  }

  async goBack(): Promise<void> {
    await this.router.changePage("SECRETS_HOME");
  }

  async render(): Promise<void> {
    this.state.secretItem = "";
    render(
      <>
        <p>
          <button
            class="uk-button uk-button-primary"
            onClick={async () => {
              await this.router.changePage("TRANSIT_NEW_KEY");
            }}
          >
            {i18next.t("transit_view_new_btn")}
          </button>
          <button
            class="uk-button uk-button-danger"
            onClick={async () => {
              await this.router.changePage("DELETE_SECRET_ENGINE");
            }}
          >
            {i18next.t("transit_view_delete_btn")}
          </button>
        </p>
        <TransitViewListItem page={this} />
      </>,
      this.router.pageContentElement,
    );
  }

  async renderPageTitle(): Promise<void> {
    render(<SecretTitleElement page={this} />, this.router.pageTitleElement);
  }

  get name(): string {
    return i18next.t("transit_view_title");
  }
}
