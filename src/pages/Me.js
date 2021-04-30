import { Page } from "../types/Page.js";
import { addClipboardNotifications, setErrorText, setPageContent, changePage } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import { getToken } from "../utils.js";
import { renewSelf } from "../api.js";
import ClipboardJS from "clipboard";
import i18next from 'i18next';


export class MePage extends Page {
  constructor() {
    super();
  }

  async render() {
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
              "data-clipboard-text": getToken(),
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
