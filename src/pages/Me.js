import { Page } from "../types/Page.js";
import { addClipboardNotifications, changePage, prePageChecks, setErrorText, setPageContent } from "../pageUtils.js";
import { getCapabilitiesPath } from "../api/getCapabilities.js";
import { renewSelf } from "../api/renewSelf.js";
import { sealVault } from "../api/sealVault.js";
import { makeElement } from "../htmlUtils.js";
import { pageState } from "../globalPageState.js";
import ClipboardJS from "clipboard";
import i18next from 'i18next';


export class MePage extends Page {
  constructor() {
    super();
  }

  async render() {
    if (!(await prePageChecks())) return;
    setPageContent(makeElement({
      tag: "ul",
      class: "uk-nav",
      children: [
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "a",
            text: i18next.t("log_out_btn"),
            onclick: () => {
              pageState.token = "";
              changePage("HOME");
            }
          })
        }),
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "a",
            text: i18next.t("copy_token_btn"),
            attributes: {
              "data-clipboard-text": pageState.token,
            },
            thenRun: (e) => {
              let clipboard = new ClipboardJS(e);
              addClipboardNotifications(clipboard);
            }
          })
        }),
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "a",
            text: i18next.t("renew_lease_btn"),
            onclick: () => {
              renewSelf().then(() => {
                changePage("HOME");
              }).catch(e => {
                setErrorText(e.message);
              });
            }
          })
        }),
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "a",
            condition: await (async () => {
              try {
                let caps = await getCapabilitiesPath("sys/seal");
                return caps.includes("sudo") && caps.includes("update");
              } catch (e) {
                return !true;
              }
            })(),
            text: i18next.t("seal_vault_btn"),
            onclick: async () => {
              await sealVault();
              changePage("UNSEAL_VAULT");
            }
          })
        }),
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "a",
            text: i18next.t("change_language_btn"),
            onclick: () => {
              changePage("SET_LANGUAGE");
            }
          })
        }),
      ]
    }));
  }

  get name() {
    return i18next.t("me_page_title");
  }
}
