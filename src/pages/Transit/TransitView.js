import { Page } from "../../types/Page.js";
import { getTransitKeys } from "../../api.js";
import { setErrorText, setTitleElement, changePage } from "../../pageUtils.js";
import { makeElement } from "../../htmlUtils.js";
import { DoesNotExistError } from "../../types/internalErrors.js";
import i18next from 'i18next';

export class TransitViewPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage("HOME");
  }
  async render() {
    pageState.currentSecret = "";

    setTitleElement(pageState);

    let newButton = makeElement({
      tag: "button",
      text: "New",
      class: ["uk-button", "uk-button-primary", "uk-margin-bottom"],
      onclick: () => {
        changePage("TRANSIT_NEW_KEY");
      }
    });
    pageContent.appendChild(newButton);

    try {
      let res = await getTransitKeys(pageState.currentBaseMount);

      pageContent.appendChild(makeElement({
        tag: "ul",
        class: ["uk-nav", "uk-nav-default"],
        children: [
          ...res.map(function (secret) {
            return makeElement({
              tag: "li",
              children: makeElement({
                tag: "a",
                text: secret,
                onclick: _ => {
                  pageState.currentSecret = secret;
                  changePage("TRANSIT_VIEW_SECRET");
                }
              })
            });
          })
        ]
      }));
    } catch (e) {
      if (e == DoesNotExistError) {
        pageContent.appendChild(makeElement({
          tag: "p",
          text: i18next.t("transit_view_none_here_text")
        }));
      } else {
        setErrorText(e.message);
      }
    }
  }

  get name() {
    return i18next.t("transit_view_title");
  }
}
