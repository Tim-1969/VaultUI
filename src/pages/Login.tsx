import { Component, JSX, render } from "preact";
import { Form } from "../elements/Form";
import { Margin } from "../elements/Margin";
import { MarginInline } from "../elements/MarginInline";
import { Page } from "../types/Page";
import { lookupSelf } from "../api/sys/lookupSelf";
import { setErrorText } from "../pageUtils";
import { usernameLogin } from "../api/auth/usernameLogin";
import i18next from "i18next";

export class TokenLoginForm extends Component<{ page: Page }, unknown> {
  constructor() {
    super();
  }

  render(): JSX.Element {
    return (
      <Form onSubmit={(data) => this.onSubmit(data)}>
        <Margin>
          <input
            class="uk-input uk-form-width-medium"
            id="tokenInput"
            name="token"
            type="password"
            placeholder={i18next.t("log_in_token_input")}
            required
          />
        </Margin>
        <MarginInline>
          <button class="uk-button uk-button-primary" type="submit">
            {i18next.t("log_in_btn")}
          </button>
        </MarginInline>
      </Form>
    );
  }

  async onSubmit(data: FormData): Promise<void> {
    const page = this.props.page;
    const token = data.get("token");
    page.state.token = token as string;

    try {
      await lookupSelf();
      await page.router.changePage("HOME");
    } catch (e: unknown) {
      const error = e as Error;
      document.querySelector("#tokenInput").classList.add("uk-form-danger");
      if (error.message == "permission denied") {
        setErrorText(i18next.t("log_in_token_login_error"));
      } else {
        setErrorText(error.message);
      }
    }
  }
}

export class UsernameLoginForm extends Component<{ page: Page }, unknown> {
  constructor() {
    super();
  }

  render(): JSX.Element {
    return (
      <Form onSubmit={(data) => this.onSubmit(data)}>
        <Margin>
          <input
            class="uk-input uk-form-width-medium"
            id="usernameInput"
            name="username"
            type="text"
            placeholder={i18next.t("log_in_username_input")}
            required
          />
        </Margin>
        <Margin>
          <input
            class="uk-input uk-form-width-medium"
            id="passwordInput"
            name="password"
            type="password"
            placeholder={i18next.t("log_in_password_input")}
            required
          />
        </Margin>
        <MarginInline>
          <button class="uk-button uk-button-primary" type="submit">
            {i18next.t("log_in_btn")}
          </button>
        </MarginInline>
      </Form>
    );
  }

  async onSubmit(data: FormData): Promise<void> {
    const page = this.props.page;

    try {
      const res = await usernameLogin(
        data.get("username") as string,
        data.get("password") as string,
      );
      page.state.token = res;
      await page.router.changePage("HOME");
    } catch (e: unknown) {
      const error = e as Error;
      document.querySelector("#usernameInput").classList.add("uk-form-danger");
      document.querySelector("#passwordInput").classList.add("uk-form-danger");
      setErrorText(error.message);
    }
  }
}

export class LoginPage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    render(
      <div>
        <ul class="uk-subnav uk-subnav-pill" uk-switcher=".switcher-container">
          <li>
            <a>{i18next.t("log_in_with_token")}</a>
          </li>
          <li>
            <a>{i18next.t("log_in_with_username")}</a>
          </li>
        </ul>
        <p id="errorText" class="uk-text-danger" />
        <ul class="uk-switcher uk-margin switcher-container">
          <li>
            <TokenLoginForm page={this} />
          </li>
          <li>
            <UsernameLoginForm page={this} />
          </li>
        </ul>
      </div>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("log_in_title");
  }
}
