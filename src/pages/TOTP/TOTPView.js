import { CopyableInputBox } from "../../elements/CopyableInputBox.js";
import { DoesNotExistError } from "../../types/internalErrors.js";
import { Page } from "../../types/Page.js";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { getTOTPCode } from "../../api/getTOTPCode";
import { getTOTPKeys } from "../../api/getTOTPKeys";
import { makeElement } from "../../htmlUtils";
import { objectToMap } from "../../utils";
import { pageState } from "../../globalPageState.ts";
import i18next from 'i18next';

export class TOTPViewPage extends Page {
  constructor() {
    super();
    this.refresher = undefined;
    this.totpListElements = {};
  }
  async render() {
    setTitleElement(pageState);
    let totpList = makeElement({ tag: "div" });
    setPageContent(makeElement({
      tag: "div",
      children: [
        makeElement({
          tag: "a",
          text: i18next.t("totp_view_new_btn"),
          onclick: _ => { changePage("NEW_TOTP"); }
        }),
        makeElement({
          tag: "p",
          id: "loadingText",
          text: i18next.t("totp_view_loading"),
        }),
        makeElement({ tag: "br" }),
        makeElement({ tag: "br" }),
        totpList
      ]
    }));


    getTOTPKeys(pageState.currentBaseMount, pageState.currentSecretPath).then(res => {
      res.forEach(async function (totpKeyName) {
        let totpListElement = this.makeTOTPListElement(totpKeyName);
        totpList.appendChild(totpListElement);
        this.totpListElements[totpKeyName] = totpListElement;
        await this.updateTOTPElement(totpKeyName, totpListElement);
      }, this);
      document.getElementById("loadingText").remove();
    }).catch(e => {
      if (e == DoesNotExistError) {
        let loadingText = document.getElementById("loadingText");
        loadingText.innerText =  i18next.t("totp_view_empty");
      } else {
        setErrorText(e.message);
      }
    });

    let totpRefresher = async () => {
      await Promise.all(Array.from(objectToMap(this.totpListElements)).map((kv) => {
        return this.updateTOTPElement(...kv);
      }))
    }
    await totpRefresher();
    this.refresher = setInterval(totpRefresher, 3000);
  }

  cleanup() {
    clearInterval(this.refresher);
    this.totpListElements = {};
  }

  async updateTOTPElement(totpKeyName, totpListElement) {
    totpListElement.setCode(await getTOTPCode(pageState.currentBaseMount, totpKeyName));
  }

  makeTOTPListElement(totpKeyName) {
    let totpKeyBox = CopyableInputBox(totpKeyName, false);
    let totpValueBox = CopyableInputBox(i18next.t("totp_view_loading_box"));

    let gridElement = makeElement({
      tag: "div",
      class: ["uk-grid", "uk-grid-small", "uk-text-expand"],
      children: [totpKeyBox, totpValueBox]
    });

    gridElement.setCode = totpValueBox.setText;

    return gridElement;
  }
  get name() {
    return i18next.t("totp_view_title");
  }
}