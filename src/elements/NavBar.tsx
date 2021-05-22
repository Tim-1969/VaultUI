import { JSX, render } from "preact";
import { PageRouter } from "z-pagerouter";
import i18next from "i18next";

export type NavBarProps = {
  router: PageRouter;
};

export function NavBar(props: NavBarProps): JSX.Element {
  return (
    <nav class="uk-navbar uk-navbar-container">
      <div class="uk-navbar-left">
        <ul class="uk-navbar-nav">
          <li>
            <a
              onClick={async () => {
                await props.router.changePage("HOME");
              }}
            >
              {i18next.t("home_btn")}
            </a>
          </li>
          <li>
            <a
              onClick={async () => {
                await props.router.goBack();
              }}
            >
              {i18next.t("back_btn")}
            </a>
          </li>
          <li>
            <a
              onClick={async () => {
                await props.router.refresh();
              }}
            >
              {i18next.t("refresh_btn")}
            </a>
          </li>
        </ul>
      </div>
      <div class="uk-navbar-right">
        <ul class="uk-navbar-nav">
          <li>
            <a
              onClick={async () => {
                await props.router.changePage("ME");
              }}
            >
              {i18next.t("me_btn")}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export function reloadNavBar(router: PageRouter): void {
  render(<NavBar router={router} />, document.querySelector("#navBarBox"));
}
