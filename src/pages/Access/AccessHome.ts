import { Page } from "../../types/Page";
import { makeElement } from "z-makeelement";
import { prePageChecks, setErrorText } from "../../pageUtils";
import i18next from "i18next";
import { Tile } from "../../elements/Tile";

export class AccessHomePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("HOME");
  }
  async render(): Promise<void> {
    await this.router.setPageContent("");
    if (!(await prePageChecks(this.router))) return;

    this.router.setPageContent(
      makeElement({
        tag: "div",
        class: "uk-child-width-1-1@s uk-child-width-1-2@m uk-grid-small uk-grid-match",
        attributes: { "uk-grid": "" },
        children: [
          Tile({
            title: i18next.t("access_auth_methods_title"),
            description: i18next.t("access_auth_methods_description"),
            icon: "sign-in",
            onclick: async () => {
              await this.router.changePage("AUTH_HOME");
            },
          }),
          Tile({
            title: i18next.t("access_entities_title"),
            description: i18next.t("access_entities_description"),
            icon: "user",
            onclick: async () => {
              setErrorText(i18next.t("not_implemented"));
              //await this.router.changePage("SECRETS_HOME");
            },
          }),
          Tile({
            title: i18next.t("access_groups_title"),
            description: i18next.t("access_groups_description"),
            icon: "users",
            onclick: async () => {
              setErrorText(i18next.t("not_implemented"));
              //await this.router.changePage("SECRETS_HOME");
            },
          }),
          Tile({
            title: i18next.t("access_leases_title"),
            description: i18next.t("access_leases_description"),
            icon: "unlock",
            onclick: async () => {
              setErrorText(i18next.t("not_implemented"));
              //await this.router.changePage("SECRETS_HOME");
            },
          }),
        ],
      }),
    );
  }
  get name(): string {
    return i18next.t("access_home_page_title");
  }
}
