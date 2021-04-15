import { Page } from "../types/Page.js";
import { setPageContent, setTitleElement } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";

export class TransitViewSecretPage extends Page {
  constructor() {
    super();
  }

  makeTile(title, description, icon = "code", onclick = _ => {}) {
    return makeElement({
      tag: "div",
      class: ["uk-tile", "uk-tile-default", "uk-tile-primary", "uk-padding-small"],
      children: makeElement({
        tag: "a",
        class: "uk-link-heading",
        onclick: onclick,
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
            this.makeTile("Encrypt", "Encrypt some plaintext or base64 encoded binary.", "lock"),
            this.makeTile("Decrypt", "Decrypt some cyphertext.", "mail"),
          ]
        }),
      ]
    }));
  }

  get name() {
    return "Transit Secret View";
  }
}