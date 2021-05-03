import { Page } from "../types/Page.js";
import { changePage, prePageChecks, setErrorText } from "../pageUtils.js";
import { getAPIURL } from "../utils.js";
import { getMounts, lookupSelf } from "../api.js";
import { makeElement } from "../htmlUtils.js";
import i18next from 'i18next';

export class HomePage extends Page {
  constructor() {
    super();
  }
  async render() {
    pageContent.innerHTML = "";
    if (!(await prePageChecks())) return;

    const textList = makeElement({
      tag: "ul",
      class: "uk-nav",
      children: [
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "span",
            html: i18next.t("vaulturl_text", {"text": getAPIURL()})
          })
        }),
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "a",
            text: i18next.t("password_generator_btn"),
            onclick: () => {
              changePage("PW_GEN");
            }
          })
        })
      ]
    });
    pageContent.appendChild(textList);

    try {
      let selfTokenInfo = await lookupSelf();
      textList.appendChild(makeElement({
        tag: "li",
        text: i18next.t("your_token_expires_in", {"date": new Date(selfTokenInfo.expire_time)})
      }));
    } catch (e) {
      setErrorText(e.message);
      if (e.message == "permission denied") {
        pageState.token = "";
        changePage("LOGIN");
      }
    }

    pageState.currentBaseMount = "";
    pageState.currentSecretPath = [];
    pageState.currentSecret = "";
    pageState.currentSecretVersion = "0";

    const navList = makeElement({ tag: "ul", class: ["uk-nav", "uk-nav-default", "uk-margin-top"] });
    pageContent.appendChild(navList);

    let mounts = await getMounts();
    // sort it by secretPath so it's in alphabetical order consistantly. 
    const mountsMap = new Map(Object.entries(mounts).sort());

    mountsMap.forEach(function (mount, baseMount) {
      if (typeof mount != 'object') return;
      if (mount == null) return;
      if (!("type" in mount)) return;
      if (!(["kv", "totp", "transit", "cubbyhole"].includes(mount.type))) return;

      let mountType = mount.type == "kv" ? "kv-v" + String(mount.options.version) : mount.type;

      let linkText = "";
      let linkPage;
      if (mount.type == "kv") {
        linkText = `K/V (v${mount.options.version}) - ${baseMount}`;
        linkPage = "KEY_VALUE_VIEW";
      } else if (mount.type == "totp") {
        linkText = `TOTP - ${baseMount}`;
        linkPage = "TOTP";
      } else if (mount.type == "transit"){
        linkText = `Transit - ${baseMount}`;
        linkPage = "TRANSIT_VIEW"; 
      } else if (mount.type == "cubbyhole"){
        linkText = `Cubbyhole - ${baseMount}`;
        linkPage = "KEY_VALUE_VIEW"; 
      }

      navList.appendChild(makeElement({
        tag: "li",
        children: makeElement({
          tag: "a",
          text: linkText,
          onclick: _ => {
            pageState.currentBaseMount = baseMount;
            pageState.currentMountType = mountType;
            changePage(linkPage);
          }
        })
      }));
    });
  }
  get name() {
    return i18next.t("home_page_title");
  }
}