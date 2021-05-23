import { AuthMethod } from "../../../api/types/auth";
import { JSX, render } from "preact";
import { Page } from "../../../types/Page";
import { listAuth } from "../../../api/auth/listAuth";
import { notImplemented } from "../../../pageUtils";
import { objectToMap } from "../../../utils";
import i18next from "i18next";

export type AuthListElementProps = {
  page: Page;
  path: string;
  method: AuthMethod;
};

export function AuthListElement(props: AuthListElementProps): JSX.Element {
  const isClickable = props.method.type != "token";

  const onHeaderLinkClick = async (props: AuthListElementProps) => {
    props.page.state.authPath = props.path;
    if (props.method.type == "userpass") {
      await props.page.router.changePage("USERPASS_USERS_LIST");
    }
  };

  return (
    <div class="uk-padding-small uk-background-secondary">
      {isClickable ? (
        <a class="uk-h4 uk-margin-bottom" onClick={() => onHeaderLinkClick(props)}>
          {props.path}
        </a>
      ) : (
        <span class="uk-h4 uk-margin-bottom">{props.path}</span>
      )}
      <span class="uk-text-muted">{` (${props.method.accessor})`}</span>
      <div class="uk-margin-top">
        <button
          class="uk-button uk-button-small uk-button-primary"
          onClick={async () => {
            props.page.state.baseMount = props.path;
            await props.page.router.changePage("AUTH_VIEW_CONFIG");
          }}
        >
          {i18next.t("auth_home_view_config")}
        </button>
        <button class="uk-button uk-button-small uk-button-primary" onClick={notImplemented}>
          {i18next.t("auth_home_edit_config")}
        </button>
      </div>
    </div>
  );
}

export class AuthHomePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("ACCESS_HOME");
  }
  async render(): Promise<void> {
    this.state.secretPath = [];
    const authList = objectToMap(await listAuth()) as Map<string, AuthMethod>;

    render(
      <div>
        {Array.from(authList).map((values: [string, AuthMethod]) => (
          <AuthListElement page={this} path={values[0]} method={values[1]} />
        ))}
      </div>,
      this.router.pageContentElement,
    );
  }
  get name(): string {
    return i18next.t("auth_home_title");
  }
}
