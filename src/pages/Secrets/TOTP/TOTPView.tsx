import { CopyableInputBox } from "../../../elements/ReactCopyableInputBox";
import { DoesNotExistError } from "../../../types/internalErrors";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getTOTPCode } from "../../../api/totp/getTOTPCode";
import { getTOTPKeys } from "../../../api/totp/getTOTPKeys";
import { makeElement } from "z-makeelement";
import { objectToMap } from "../../../utils";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";
import { render, JSX } from "preact";

export interface TOTPListElement extends HTMLElement {
  setCode(code: string): void;
}

function quickHash(str: string): string {
  var hash = 0;
  if (str.length == 0) {
    return String(hash).toString();
  }
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return String(hash).toString();
}


export function TOTPGridItem(props: { item_key: string, item_value: string }): JSX.Element {
  return (
    <div class="uk-grid uk-grid-small uk-text-left" uk-grid>
      <CopyableInputBox text={props.item_key} copyable />
      <CopyableInputBox text={props.item_value} copyable />
    </div>
  );
}

export class TOTPViewPage extends Page {
  constructor() {
    super();
    this.refresher = undefined;
  }

  refresher: number;

  async goBack(): Promise<void> {
    await this.router.changePage("SECRETS_HOME");
  }

  async render(): Promise<void> {
    console.log(quickHash("abc"));

    render((
      <div>
        <button
          class="uk-button uk-button-primary uk-margin-bottom"
          onClick={async () => {
            await this.router.changePage("NEW_TOTP");
          }}>
          {i18next.t("totp_view_new_btn")}
        </button>
        <p id="loadingText">{i18next.t("totp_view_loading")}</p>
        <br />
        <br />
        <div id="totpList"></div>
      </div>
    ), this.router.pageContentElement)

    try {
      await this.updateTOTPElements();
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
      await this.updateTOTPElements();
    };

    this.refresher = setInterval(async () => {
      await totpRefresher();
    }, 3000) as unknown as number;
  }

  async cleanup(): Promise<void> {
    clearInterval(this.refresher);
  }

  async updateTOTPElements(): Promise<void> {
    render((
      <>
        {await Promise.all(Array.from(await getTOTPKeys(this.state.baseMount)).map(async (key) => 
          <TOTPGridItem 
            item_key={String(key).toString()}
            item_value={await getTOTPCode(this.state.baseMount, key)}
          />
        ))}
      </>
    ), document.querySelector("#totpList"))
  }

  makeTOTPListElement(totpKeyName: string): TOTPListElement {

    const gridElement = makeElement({
      tag: "div",
      class: ["uk-grid", "uk-grid-small", "uk-text-expand"],
    }) as TOTPListElement;


    return gridElement;
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router);
  }

  get name(): string {
    return i18next.t("totp_view_title");
  }
}
