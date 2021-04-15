import { Page } from "../types/Page.js";
import { getTOTPKeys, getTOTPCode } from "../api.js";
import { setTitleElement, setPageContent } from "../pageUtils.js";
import { CopyableInputBox } from "../elements/CopyableInputBox.js";
import { makeElement } from "../htmlUtils.js";

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
          text: "Add new TOTP",
          onclick: _ => { changePage(pages.NEW_TOTP); }
        }),
        makeElement({
          tag: "p",
          id: "loadingText",
          text: "Loading TOTP Codes..",
        }),
        makeElement({tag: "br"}),
        makeElement({tag: "br"}),
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
    });
  }

  cleanup() {
    this.refreshers.forEach(refresher => clearInterval(refresher));
  }

  makeTOTPListElement(totpKeyName) {
    let totpKeyBox = CopyableInputBox(totpKeyName, false);
    let totpValueBox = CopyableInputBox("Loading..");

    let gridElement = makeElement({
      tag: "div",
      class: ["uk-grid", "uk-grid-small", "uk-text-expand"],
      children: [totpKeyBox, totpValueBox]
    });

    gridElement.setCode = totpValueBox.setText;

    return gridElement;
  }
  get name() {
    return "TOTP";
  }
}