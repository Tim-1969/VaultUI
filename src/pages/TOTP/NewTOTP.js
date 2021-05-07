import { Margin } from "../../elements/Margin.js";
import { MarginInline } from "../../elements/MarginInline.js";
import { Page } from "../../types/Page";
import { addNewTOTP } from "../../api/addNewTOTP";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState.ts";
import i18next from 'i18next';


export class NewTOTPPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage("TOTP");
  }
  render() {
    setTitleElement(pageState);

    let totpForm = makeElement({
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

    });
    setPageContent(totpForm);

    totpForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let formData = new FormData(totpForm);
      let parms = {
        url: formData.get("uri"),
        key: formData.get("key").replaceAll("-", "").replaceAll(" ", "").toUpperCase(),
        name: formData.get("name"),
        generate: false
      };
      addNewTOTP(pageState.currentBaseMount, parms).then(_ => {
        changePage("TOTP");
      }).catch(e => {
        setErrorText(`API Error: ${e.message}`);
      });
    });
  }

  get titleSuffix() {
    return i18next.t("totp_new_suffix");
  }

  get name() {
    return i18next.t("totp_new_title");
  }
}