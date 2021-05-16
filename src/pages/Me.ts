import { Page } from "../types/Page";
import { addClipboardNotifications, prePageChecks, setErrorText } from "../pageUtils";
import { getCapabilitiesPath } from "../api/sys/getCapabilities";
import { makeElement } from "../htmlUtils";
import { renewSelf } from "../api/sys/renewSelf";
import { sealVault } from "../api/sys/sealVault";
import ClipboardJS from "clipboard";
import i18next from "i18next";

export class MePage extends Page {
  constructor() {
    super();
  }

  async render(): Promise<void> {
    if (!(await prePageChecks(this.router))) return;
    await this.router.setPageContent(
      makeElement({
        tag: "ul",
        class: "uk-nav",
        children: [
          makeElement({
            tag: "li",
            children: makeElement({
              tag: "a",
              text: i18next.t("log_out_btn"),
              onclick: async () => {
                this.state.token = "";
                await this.router.changePage("HOME");
              },
            }),
          }),
          makeElement({
            tag: "li",
            children: makeElement({
              tag: "a",
              text: i18next.t("copy_token_btn"),
              attributes: {
                "data-clipboard-text": this.state.token,
              },
              thenRun: (e) => {
                const clipboard = new ClipboardJS(e);
                addClipboardNotifications(clipboard);
              },
            }),
          }),
          makeElement({
            tag: "li",
            children: makeElement({
              tag: "a",
              text: i18next.t("renew_lease_btn"),
              onclick: () => {
                renewSelf()
                  .then(() => {
                    void this.router.changePage("HOME");
                  })
                  .catch((e: Error) => {
                    setErrorText(e.message);
                  });
              },
            }),
          }),
          makeElement({
            tag: "li",
            children: makeElement({
              tag: "a",
              condition: await (async () => {
                try {
                  const caps = await getCapabilitiesPath("sys/seal");
                  return caps.includes("sudo") && caps.includes("update");
                } catch (e) {
                  return !true;
                }
              })(),
              text: i18next.t("seal_vault_btn"),
              onclick: async () => {
                await sealVault();
                await this.router.changePage("UNSEAL_VAULT");
              },
            }),
          }),
          makeElement({
            tag: "li",
            children: makeElement({
              tag: "a",
              text: i18next.t("change_language_btn"),
              onclick: async () => {
                await this.router.changePage("SET_LANGUAGE");
              },
            }),
          }),
        ],
      }),
    );
  }

  get name(): string {
    return i18next.t("me_page_title");
  }
}
