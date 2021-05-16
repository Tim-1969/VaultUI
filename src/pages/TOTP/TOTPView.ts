import { CopyableInputBox } from "../../elements/CopyableInputBox";
import { DoesNotExistError } from "../../types/internalErrors";
import { Page } from "../../types/Page";
import { SecretTitleElement } from "../../elements/SecretTitleElement";
import { getTOTPCode } from "../../api/totp/getTOTPCode";
import { getTOTPKeys } from "../../api/totp/getTOTPKeys";
import { makeElement } from "../../htmlUtils";
import { objectToMap } from "../../utils";
import { setErrorText } from "../../pageUtils";
import i18next from "i18next";

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
    const totpList = makeElement({ tag: "div" });
    await this.router.setPageContent(
      makeElement({
        tag: "div",
        children: [
          makeElement({
            tag: "button",
            text: i18next.t("totp_view_new_btn"),
            class: ["uk-button", "uk-button-primary", "uk-margin-bottom"],
            onclick: async () => {
              await this.router.changePage("NEW_TOTP");
            },
          }),
          makeElement({
            tag: "p",
            id: "loadingText",
            text: i18next.t("totp_view_loading"),
          }),
          makeElement({ tag: "br" }),
          makeElement({ tag: "br" }),
          totpList,
        ],
      }),
    );

    try {
      const res = await getTOTPKeys(this.state.currentBaseMount);
      for (const totpKeyName of res) {
        const totpListElement = this.makeTOTPListElement(totpKeyName);
        totpList.appendChild(totpListElement);
        this.totpListElements[totpKeyName] = totpListElement;
        void this.updateTOTPElement(totpKeyName, totpListElement);
      }
      document.getElementById("loadingText").remove();
    } catch (e: unknown) {
      const error = e as Error;
      if (error == DoesNotExistError) {
        const loadingText = document.getElementById("loadingText");
        loadingText.innerText = i18next.t("totp_view_empty");
      } else {
        setErrorText(error.message);
      }
    }

    const totpRefresher = async () => {
      await Promise.all(
        Array.from(objectToMap(this.totpListElements)).map((kv: [string, TOTPListElement]) => {
          return this.updateTOTPElement(...kv);
        }),
      );
    };
    await totpRefresher();
    this.refresher = setInterval(() => {
      void totpRefresher();
    }, 3000) as unknown as number;
  }

  async cleanup(): Promise<void> {
    clearInterval(this.refresher);
    this.totpListElements = {};
  }

  async updateTOTPElement(totpKeyName: string, totpListElement: TOTPListElement): Promise<void> {
    totpListElement.setCode(await getTOTPCode(this.state.currentBaseMount, totpKeyName));
  }

  makeTOTPListElement(totpKeyName: string): TOTPListElement {
    const totpKeyBox = CopyableInputBox(totpKeyName, false);
    const totpValueBox = CopyableInputBox(i18next.t("totp_view_loading_box"));

    const gridElement = makeElement({
      tag: "div",
      class: ["uk-grid", "uk-grid-small", "uk-text-expand"],
      children: [totpKeyBox, totpValueBox],
    }) as TOTPListElement;

    gridElement.setCode = (code: string) => totpValueBox.setText(code);

    return gridElement;
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router);
  }

  get name(): string {
    return i18next.t("totp_view_title");
  }
}
