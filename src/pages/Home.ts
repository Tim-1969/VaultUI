import { MountType, getMounts } from "../api/sys/getMounts";
import { Page } from "../types/Page";
import { changePage, prePageChecks, setErrorText, setPageContent } from "../pageUtils";
import { lookupSelf } from "../api/sys/lookupSelf";
import { makeElement } from "../htmlUtils";
import { pageState } from "../globalPageState";
import { sortedObjectMap } from "../utils";
import i18next from 'i18next';

export class HomePage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    setPageContent("");
    if (!(await prePageChecks())) return;

    const homePageContent = makeElement({tag: "div"});
    setPageContent(homePageContent);
    const textList = makeElement({
      tag: "ul",
      class: "uk-nav",
      children: [
        makeElement({
          tag: "li",
          children: makeElement({
            tag: "span",
            html: i18next.t("vaulturl_text", {"text": pageState.apiURL})
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
    homePageContent.appendChild(textList);

    try {
      const selfTokenInfo = await lookupSelf();
      textList.appendChild(makeElement({
        tag: "li",
        text: i18next.t("your_token_expires_in", {"date": new Date(selfTokenInfo.expire_time)})
      }));
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(error.message);
      if (error.message == "permission denied") {
        pageState.token = "";
        changePage("LOGIN");
      }
    }

    pageState.currentBaseMount = "";
    pageState.currentSecretPath = [];
    pageState.currentSecret = "";
    pageState.currentSecretVersion = null;

    const navList = makeElement({ tag: "ul", class: ["uk-nav", "uk-nav-default", "uk-margin-top"] });
    homePageContent.appendChild(navList);

    const mounts = await getMounts();
    // sort it by secretPath so it's in alphabetical order consistantly. 
    const mountsMap = sortedObjectMap(mounts);

    mountsMap.forEach(function (mount: MountType, baseMount) {
      if (typeof mount != 'object') return;
      if (mount == null) return;
      if (!("type" in mount)) return;
      if (!(["kv", "totp", "transit", "cubbyhole"].includes(mount.type))) return;

      const mountType = mount.type == "kv" ? "kv-v" + String(mount.options.version) : mount.type;

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
          onclick: () => {
            pageState.currentBaseMount = baseMount;
            pageState.currentMountType = mountType;
            changePage(linkPage);
          }
        })
      }));
    });
  }
  get name(): string {
    return i18next.t("home_page_title");
  }
}