import { Page } from "../../types/Page.js";
import { changePage, setPageContent, setTitleElement } from "../../pageUtils.js";
import { makeElement } from "../../htmlUtils.js";
import i18next from 'i18next';

export class TransitViewSecretPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage("TRANSIT_VIEW");
  }

  makeTile(title, description, icon, iconText, onclick = _ => { }) {
    return makeElement({
      tag: "a",
      class: "uk-link-heading",
      onclick: onclick,
      children: makeElement({
        tag: "div",
        class: ["uk-tile", "uk-tile-default", "uk-tile-primary", "uk-padding-small"],
        children: [
          makeElement({
            tag: "p",
            class: "uk-h4",
            text: title,
            children: makeElement({
              tag: "span",
              class: ["uk-icon", "uk-margin-small-left"],
              attributes: {
                "uk-icon": `icon: ${icon}`,
                "role": "img",
                "aria-label": `${title} icon`
              }
            })
          }),
          makeElement({
            tag: "span",
            class: "uk-text-muted",
            text: description
          })
        ]
      })
    });
  }

  async render() {
    setTitleElement(pageState);
    setPageContent(makeElement({
      tag: "div",
      class: ["uk-child-width-1-2", "uk-grid-collapse", "uk-grid-small"],
      attributes: { "uk-grid": "" },
      children: [
        makeElement({
          tag: "div",
          children: [
            this.makeTile(
              i18next.t("transit_view_encrypt_text"),
              i18next.t("transit_view_encrypt_description"),
              "lock",
              i18next.t("transit_view_encrypt_icon_text"),
              _ => { changePage("TRANSIT_ENCRYPT"); }
            ),
            this.makeTile(
              i18next.t("transit_view_decrypt_text"),
              i18next.t("transit_view_decrypt_description"),
              "mail",
              i18next.t("transit_view_decrypt_icon_text"),
              _ => { changePage("TRANSIT_DECRYPT"); }
            ),
          ]
        }),
      ]
    }));
  }

  get name() {
    return i18next.t("transit_view_secret_title");
  }
}