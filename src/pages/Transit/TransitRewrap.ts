import { CopyableModal } from "../../elements/CopyableModal";
import { FileUploadInput } from "../../elements/FileUploadInput";
import { Margin } from "../../elements/Margin";
import { Page } from "../../types/Page";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import UIkit from 'uikit/dist/js/uikit.min.js';
import i18next from "i18next";
import { getTransitKey } from "../../api/transit/getTransitKey";
import { objectToMap } from "../../utils";
import { Option } from "../../elements/Option";
import { transitRewrap } from "../../api/transit/transitRewrap";

type versionOption = { version: string; label: string }

export class TransitRewrapPage extends Page {
  constructor() {
    super();
  }

  goBack(): void {
    changePage("TRANSIT_VIEW_SECRET");
  }

  transitRewrapForm: HTMLFormElement;

  async render(): Promise<void> {
    setTitleElement(pageState);
    let transitKey = await getTransitKey(pageState.currentBaseMount, pageState.currentSecret);

    let stringVersions = Array.from(objectToMap(transitKey.keys).keys()).reverse() as any as string[];
    let versions = stringVersions.map((val) => parseInt(val, 10)) as any as number[];

    // get the selectable version options in the same 
    // format the official UI uses. 
    // e.g: ["2 (latest)", "1"]

    let options: versionOption[] = versions.map((val): versionOption => {
      let i18nkey = val == Math.max(...versions) ?
        "transit_rewrap_latest_version_option_text"
        :
        "transit_rewrap_version_option_text";
      return {
        version: String(val),
        label: i18next.t(i18nkey, { version_num: String(val) }),
      }
    })

    setPageContent("");
    this.transitRewrapForm = makeElement({
      tag: "form",
      children: [
        makeElement({
          tag: "select",
          name: "version",
          class: ["uk-select", "uk-width-1-2"],
          children: options.map((option): HTMLElement => Option(option.label, option.version))
        }),
        Margin(makeElement({
          tag: "textarea",
          class: ["uk-textarea", "uk-width-1-2"],
          attributes: {
            placeholder: i18next.t("transit_rewrap_input_placeholder"),
            name: "ciphertext",
          }
        })),
        makeElement({
          tag: "p",
          id: "errorText",
          class: "uk-text-danger"
        }),
        makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: i18next.t("transit_rewrap_rewrap_btn"),
          attributes: {
            type: "submit",
          }
        })
      ]
    }) as HTMLFormElement;
    setPageContent(this.transitRewrapForm);
    this.transitRewrapForm.addEventListener("submit", async function (e: Event) {
      e.preventDefault();
      await this.transitRewrapFormHandler();
    }.bind(this));
  }

  async transitRewrapFormHandler(): Promise<void> {
    const formData = new FormData(this.transitRewrapForm);
    const ciphertext = formData.get("ciphertext") as string;
    try {
      let res = await transitRewrap(
        pageState.currentBaseMount,
        pageState.currentSecret,
        { 
          ciphertext: formData.get("ciphertext") as string,
          key_version: parseInt(formData.get("version") as string, 10),
         }
      );
      const modal = CopyableModal(i18next.t("transit_rewrap_result_modal_title"), res.ciphertext);
      document.body.querySelector("#pageContent").appendChild(modal);
      UIkit.modal(modal).show();
    } catch (e) {
      setErrorText(`API Error: ${e.message}`);
    }
  }

  get titleSuffix(): string {
    return i18next.t("transit_rewrap_suffix");
  }

  get name(): string {
    return i18next.t("transit_rewrap_title");
  }
}
