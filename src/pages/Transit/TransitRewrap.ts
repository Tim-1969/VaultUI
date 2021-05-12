import { CopyableModal } from "../../elements/CopyableModal";
import { Margin } from "../../elements/Margin";
import { Option } from "../../elements/Option";
import { Page } from "../../types/Page";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { getTransitKey } from "../../api/transit/getTransitKey";
import { makeElement } from "../../htmlUtils";
import { objectToMap } from "../../utils";
import { pageState } from "../../globalPageState";
import { transitRewrap } from "../../api/transit/transitRewrap";
import i18next from "i18next";

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
    const transitKey = await getTransitKey(pageState.currentBaseMount, pageState.currentSecret);

    const stringVersions = Array.from(objectToMap(transitKey.keys).keys()).reverse() as unknown as string[];
    const versions = stringVersions.map((val): number => parseInt(val, 10));

    // get the selectable version options in the same 
    // format the official UI uses. 
    // e.g: ["2 (latest)", "1"]

    const options: versionOption[] = versions.map((val): versionOption => {
      const i18nkey = val == Math.max(...versions) ?
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

    this.transitRewrapForm.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      void this.transitRewrapFormHandler();
    });
  }

  async transitRewrapFormHandler(): Promise<void> {
    const formData = new FormData(this.transitRewrapForm);
    try {
      const res = await transitRewrap(
        pageState.currentBaseMount,
        pageState.currentSecret,
        { 
          ciphertext: formData.get("ciphertext") as string,
          key_version: parseInt(formData.get("version") as string, 10),
         }
      );
      const modal = CopyableModal(i18next.t("transit_rewrap_result_modal_title"), res.ciphertext);
      document.body.querySelector("#pageContent").appendChild(modal);
      modal.show();
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(`API Error: ${error.message}`);
    }
  }

  get titleSuffix(): string {
    return i18next.t("transit_rewrap_suffix");
  }

  get name(): string {
    return i18next.t("transit_rewrap_title");
  }
}
