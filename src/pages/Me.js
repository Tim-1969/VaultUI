import { Page } from "../types/Page.js";
import { setErrorText, setPageContent, changePage } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import { getToken } from "../utils.js";
import { renewSelf } from "../api.js";
import ClipboardJS from "clipboard";


export class MePage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage("HOME");
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
            text: "Log Out",
            onclick: () => {
              localStorage.removeItem("token");
              changePage("HOME");
            }
          })
        }),
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "a",
            text: "Copy Token",
            attributes: {
              "data-clipboard-text": getToken(),
            },
            thenRun: (e) => {
              new ClipboardJS(e);
            }
          })
        }),
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "a",
            text: "Renew Lease",
            onclick: () => {
              renewSelf().then(() => {
                changePage("HOME");
              }).catch(e => {
                setErrorText(e.message);
              });
            }
          })
        })
      ]
    }));
  }

  get name() {
    return "Me";
  }
}
