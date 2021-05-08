import { CopyableInputBox } from "../../elements/CopyableInputBox";
import { DoesNotExistError } from "../../types/internalErrors";
import { Page } from "../../types/Page";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { getTOTPCode } from "../../api/getTOTPCode";
import { getTOTPKeys } from "../../api/getTOTPKeys";
import { makeElement } from "../../htmlUtils";
import { objectToMap } from "../../utils";
import { pageState } from "../../globalPageState";
import i18next from 'i18next';

export interface TOTPListElement extends HTMLElement {
  setCode(code: string): void;
}


export class TOTPViewPage extends Page {
  constructor() {
    super();
    this.refresher = undefined;
    this.totpListElements = {};
  }

  refresher: number;
  totpListElements: Record<string, TOTPListElement>;

  async render(): Promise<void> {
    setTitleElement(pageState);
    const totpList = makeElement({ tag: "div" });
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


    getTOTPKeys(pageState.currentBaseMount).then(res => {
      res.forEach(async function (totpKeyName) {
        const totpListElement = this.makeTOTPListElement(totpKeyName);
        totpList.appendChild(totpListElement);
        this.totpListElements[totpKeyName] = totpListElement;
        await this.updateTOTPElement(totpKeyName, totpListElement);
      }, this);
      document.getElementById("loadingText").remove();
    }).catch(e => {
      if (e == DoesNotExistError) {
        const loadingText = document.getElementById("loadingText");
        loadingText.innerText = i18next.t("totp_view_empty");
      } else {
        setErrorText(e.message);
      }
    });

    const totpRefresher = async () => {
      await Promise.all(Array.from(objectToMap(this.totpListElements)).map((kv) => {
        return this.updateTOTPElement(...kv);
      }))
    }
    await totpRefresher();
    this.refresher = setInterval(totpRefresher, 3000) as unknown as number;
  }

  cleanup(): void {
    clearInterval(this.refresher);
    this.totpListElements = {};
  }

  async updateTOTPElement(totpKeyName: string, totpListElement: TOTPListElement): Promise<void> {
    totpListElement.setCode(await getTOTPCode(pageState.currentBaseMount, totpKeyName));
  }

  makeTOTPListElement(totpKeyName: string): TOTPListElement {
    const totpKeyBox = CopyableInputBox(totpKeyName, false);
    const totpValueBox = CopyableInputBox(i18next.t("totp_view_loading_box"));

    const gridElement = makeElement({
      tag: "div",
      class: ["uk-grid", "uk-grid-small", "uk-text-expand"],
      children: [totpKeyBox, totpValueBox]
    }) as TOTPListElement;

    gridElement.setCode = totpValueBox.setText;

    return gridElement;
  }

  get name(): string {
    return i18next.t("totp_view_title");
  }
}