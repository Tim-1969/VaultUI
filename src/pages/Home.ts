import { MountType, getMounts } from "../api/sys/getMounts";
import { Page } from "../types/Page";
import { getCapabilitiesPath } from "../api/sys/getCapabilities";
import { lookupSelf } from "../api/sys/lookupSelf";
import { makeElement } from "z-makeelement";
import { prePageChecks, setErrorText } from "../pageUtils";
import { sortedObjectMap } from "../utils";
import i18next from "i18next";

export class HomePage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    await this.router.setPageContent("");
    if (!(await prePageChecks(this.router))) return;

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
            html: i18next.t("vaulturl_text", { text: this.state.apiURL }),
          }),
        }),
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "a",
            text: i18next.t("password_generator_btn"),
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
          text: i18next.t("your_token_expires_in", {
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

    const mountsCapabilities = await getCapabilitiesPath("/sys/mounts");
    if (mountsCapabilities.includes("sudo") && mountsCapabilities.includes("create")) {
      textList.appendChild(
        makeElement({
          tag: "button",
          text: i18next.t("home_new_secrets_engine_button"),
          class: ["uk-button", "uk-button-primary", "uk-margin-top"],
          onclick: async () => {
            await this.router.changePage("NEW_SECRETS_ENGINE");
          },
        }),
      );
    }

    this.state.currentBaseMount = "";
    this.state.currentSecretPath = [];
    this.state.currentSecret = "";
    this.state.currentSecretVersion = null;

    const navList = makeElement({
      tag: "ul",
      class: ["uk-nav", "uk-nav-default", "uk-margin-top"],
    });
    homePageContent.appendChild(navList);

    const mounts = await getMounts();
    // sort it by secretPath so it's in alphabetical order consistantly.
    const mountsMap = sortedObjectMap(mounts);

    mountsMap.forEach((mount: MountType, baseMount) => {
      if (typeof mount != "object") return;
      if (mount == null) return;
      if (!("type" in mount)) return;
      if (!["kv", "totp", "transit", "cubbyhole"].includes(mount.type)) return;

      const mountType = mount.type == "kv" ? "kv-v" + String(mount.options.version) : mount.type;

      let linkText = "";
      let linkPage: string;
      if (mount.type == "kv") {
        linkText = `K/V (v${mount.options.version}) - ${baseMount}`;
        linkPage = "KEY_VALUE_VIEW";
      } else if (mount.type == "totp") {
        linkText = `TOTP - ${baseMount}`;
        linkPage = "TOTP";
      } else if (mount.type == "transit") {
        linkText = `Transit - ${baseMount}`;
        linkPage = "TRANSIT_VIEW";
      } else if (mount.type == "cubbyhole") {
        linkText = `Cubbyhole - ${baseMount}`;
        linkPage = "KEY_VALUE_VIEW";
      }

      navList.appendChild(
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "a",
            text: linkText,
            onclick: async () => {
              this.state.currentBaseMount = baseMount;
              this.state.currentMountType = mountType;
              await this.router.changePage(linkPage);
            },
          }),
        }),
      );
    });
  }
  get name(): string {
    return i18next.t("home_page_title");
  }
}
