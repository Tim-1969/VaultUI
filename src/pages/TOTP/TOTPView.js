import { Page } from "../../types/Page.js";
import { getTOTPKeys, getTOTPCode } from "../../api.js";
import { setTitleElement, setPageContent, changePage, setErrorText } from "../../pageUtils.js";
import { CopyableInputBox } from "../../elements/CopyableInputBox.js";
import { makeElement } from "../../htmlUtils.js";
import { DoesNotExistError } from "../../types/internalErrors.js";
import i18next from 'i18next';

export class TOTPViewPage extends Page {
  constructor() {
    super();
    this.refreshers = [];
  }
  render() {
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
      res.forEach(function (totpKeyName) {
        let totpListElement = this.makeTOTPListElement(totpKeyName);
        totpList.appendChild(totpListElement);
        let totpRefresher = async function (totpKeyName, totpListElement) {
          totpListElement.setCode(await getTOTPCode(pageState.currentBaseMount, totpKeyName));
        };
        totpRefresher(totpKeyName, totpListElement);
        this.refreshers.push(setInterval(totpRefresher, 3000, totpKeyName, totpListElement));
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

  }

  cleanup() {
    this.refreshers.forEach(refresher => clearInterval(refresher));
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