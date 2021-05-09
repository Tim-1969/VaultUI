import { Margin } from "../../elements/Margin";
import { MarginInline } from "../../elements/MarginInline";
import { Page } from "../../types/Page";
import { addNewTOTP } from "../../api/totp/addNewTOTP";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import i18next from 'i18next';

function replaceAll(str: string, replace: string, replaceWith: string): string {
  return str.replace(new RegExp(replace, 'g'), replaceWith);
}
function removeDashSpaces(str: string): string {
  str = replaceAll(str, "-", "");
  str = replaceAll(str, " ", "");
  return str;
}

export class NewTOTPPage extends Page {
  constructor() {
    super();
  }
  goBack(): void {
    changePage("TOTP");
  }
  render(): void {
    setTitleElement(pageState);

    const totpForm = makeElement({
      tag: "form",
      children: [
        Margin(makeElement({
          tag: "input",
          class: ["uk-input", "uk-form-width-medium"],
          attributes: {
            required: true,
            type: "text",
            placeholder: i18next.t("totp_new_name_text"),
            name: "name"
          }
        })),
        makeElement({
          tag: "p",
          text: i18next.t("totp_new_info")
        }),
        Margin(makeElement({
          tag: "input",
          class: ["uk-input", "uk-form-width-medium"],
          attributes: {
            type: "text",
            placeholder: i18next.t("totp_new_uri_input"),
            name: "uri"
          }
        })),
        Margin(makeElement({
          tag: "input",
          class: ["uk-input", "uk-form-width-medium"],
          attributes: {
            type: "text",
            placeholder: i18next.t("totp_new_key_input"),
            name: "key"
          }
        })),
        makeElement({
          tag: "p",
          id: "errorText",
          class: "uk-text-danger"
        }),
        MarginInline(makeElement({
          tag: "button",
          class: ["uk-button", "uk-button-primary"],
          text: i18next.t("totp_new_add_btn"),
          attributes: {
            type: "submit"
          }
        }))
      ]
    }) as HTMLFormElement;
    setPageContent(totpForm);

    totpForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(totpForm);
      const parms = {
        url: formData.get("uri") as string,
        key: removeDashSpaces(formData.get("key") as string).toUpperCase(),
        name: formData.get("name") as string,
        generate: false
      };
      addNewTOTP(pageState.currentBaseMount, parms).then(_ => {
        changePage("TOTP");
      }).catch(e => {
        setErrorText(`API Error: ${e.message}`);
      });
    });
  }

  get titleSuffix(): string {
    return i18next.t("totp_new_suffix");
  }

  get name(): string {
    return i18next.t("totp_new_title");
  }
}