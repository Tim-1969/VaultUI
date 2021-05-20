import { MountType, getMounts } from "../../api/sys/getMounts";
import { Page } from "../../types/Page";
import { getCapabilitiesPath } from "../../api/sys/getCapabilities";
import { makeElement } from "z-makeelement";
import { prePageChecks } from "../../pageUtils";
import { sortedObjectMap } from "../../utils";
import i18next from "i18next";

export class SecretsHomePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("HOME");
  }
  async render(): Promise<void> {
    await this.router.setPageContent("");
    if (!(await prePageChecks(this.router))) return;

    const homePageContent = makeElement({ tag: "div" });
    await this.router.setPageContent(homePageContent);

    const mountsCapabilities = await getCapabilitiesPath("/sys/mounts");
    if (mountsCapabilities.includes("sudo") && mountsCapabilities.includes("create")) {
      homePageContent.appendChild(
        makeElement({
          tag: "button",
          text: i18next.t("secrets_home_new_secrets_engine_button"),
          class: ["uk-button", "uk-button-primary"],
          onclick: async () => {
            await this.router.changePage("NEW_SECRETS_ENGINE");
          },
        }),
      );
    }

    this.state.baseMount = "";
    this.state.secretPath = [];
    this.state.secretItem = "";
    this.state.secretVersion = null;

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

      const secretMountType =
        mount.type == "kv" ? "kv-v" + String(mount.options.version) : mount.type;

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
              this.state.baseMount = baseMount;
              this.state.secretMountType = secretMountType;
              await this.router.changePage(linkPage);
            },
          }),
        }),
      );
    });
  }
  get name(): string {
    return i18next.t("secrets_home_page_title");
  }
}
