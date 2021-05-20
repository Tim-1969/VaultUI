import { Form } from "../../../elements/Form";
import { Margin } from "../../../elements/Margin";
import { MarginInline } from "../../../elements/MarginInline";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { addNewTOTP } from "../../../api/totp/addNewTOTP";
import { makeElement } from "z-makeelement";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

function replaceAll(str: string, replace: string, replaceWith: string): string {
  return str.replace(new RegExp(replace, "g"), replaceWith);
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
  async goBack(): Promise<void> {
    await this.router.changePage("TOTP");
  }
  async render(): Promise<void> {
    await this.router.setPageContent(
      Form(
        [
          Margin(
            makeElement({
              tag: "input",
              class: ["uk-input", "uk-form-width-medium"],
              attributes: {
                required: "true",
                type: "text",
                placeholder: i18next.t("totp_new_name_text"),
                name: "name",
              },
            }),
          ),
          makeElement({
            tag: "p",
            text: i18next.t("totp_new_info"),
          }),
          Margin(
            makeElement({
              tag: "input",
              class: ["uk-input", "uk-form-width-medium"],
              attributes: {
                type: "text",
                placeholder: i18next.t("totp_new_uri_input"),
                name: "uri",
              },
            }),
          ),
          Margin(
            makeElement({
              tag: "input",
              class: ["uk-input", "uk-form-width-medium"],
              attributes: {
                type: "text",
                placeholder: i18next.t("totp_new_key_input"),
                name: "key",
              },
            }),
          ),
          makeElement({
            tag: "p",
            id: "errorText",
            class: "uk-text-danger",
          }),
          MarginInline(
            makeElement({
              tag: "button",
              class: ["uk-button", "uk-button-primary"],
              text: i18next.t("totp_new_add_btn"),
              attributes: {
                type: "submit",
              },
            }),
          ),
        ],
        async (form: HTMLFormElement) => {
          const formData = new FormData(form);

          const parms = {
            url: formData.get("uri") as string,
            key: removeDashSpaces(formData.get("key") as string).toUpperCase(),
            name: formData.get("name") as string,
            generate: false,
          };

          try {
            await addNewTOTP(this.state.baseMount, parms);
            await this.router.changePage("TOTP");
          } catch (e: unknown) {
            const error = e as Error;
            setErrorText(`API Error: ${error.message}`);
          }
        },
      ),
    );
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router, i18next.t("totp_new_suffix"));
  }

  get name(): string {
    return i18next.t("totp_new_title");
  }
}
