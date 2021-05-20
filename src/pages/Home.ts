import { Page } from "../types/Page";
import { Tile } from "../elements/Tile";
import { lookupSelf } from "../api/sys/lookupSelf";
import { makeElement } from "z-makeelement";
import { prePageChecks, setErrorText } from "../pageUtils";
import i18next from "i18next";

export class HomePage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    await this.router.setPageContent("");
    if (!(await prePageChecks(this.router))) return;

    this.state.baseMount = "";
    this.state.secretPath = [];
    this.state.secretItem = "";
    this.state.secretVersion = null;

    const homePageContent = makeElement({ tag: "div" });
    await this.router.setPageContent(homePageContent);
    const textList = makeElement({
      tag: "ul",
      class: "uk-nav",
      children: [
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "span",
            html: i18next.t("home_vaulturl_text", { text: this.state.apiURL }),
          }),
        }),
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "a",
            text: i18next.t("home_password_generator_btn"),
            onclick: async () => {
              await this.router.changePage("PW_GEN");
            },
          }),
        }),
      ],
    });
    homePageContent.appendChild(textList);

    try {
      const selfTokenInfo = await lookupSelf();
      textList.appendChild(
        makeElement({
          tag: "li",
          text: i18next.t("home_your_token_expires_in", {
            date: new Date(selfTokenInfo.expire_time),
          }),
        }),
      );
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(error.message);
      if (error.message == "permission denied") {
        this.state.token = "";
        await this.router.changePage("LOGIN");
      }
    }

    homePageContent.appendChild(
      makeElement({
        tag: "div",
        class:
          "uk-child-width-1-1@s uk-child-width-1-2@m uk-grid-small uk-grid-match uk-margin-top",
        attributes: { "uk-grid": "" },
        children: [
          Tile({
            title: i18next.t("home_secrets_title"),
            description: i18next.t("home_secrets_description"),
            icon: "file-edit",
            onclick: async () => {
              await this.router.changePage("SECRETS_HOME");
            },
          }),
          Tile({
            title: i18next.t("home_access_title"),
            description: i18next.t("home_access_description"),
            icon: "users",
            onclick: async () => {
              await this.router.changePage("ACCESS_HOME");
            },
          }),
        ],
      }),
    );
  }
  get name(): string {
    return i18next.t("home_page_title");
  }
}
