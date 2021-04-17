import { Page } from "../../types/Page.js";
import { DoesNotExistError, getTransitKeys } from "../../api.js";
import { setErrorText, setTitleElement } from "../../pageUtils.js";
import { makeElement } from "../../htmlUtils.js";

export class TransitViewPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage(pages.HOME);
  }
  async render() {
    pageState.currentSecret = "";

    setTitleElement(pageState);

    let newButton = makeElement({
      tag: "button",
      text: "New",
      class: ["uk-button", "uk-button-primary", "uk-margin-bottom"],
      onclick: () => {
        changePage(pages.TRANSIT_NEW_KEY);
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
                  changePage(pages.TRANSIT_VIEW_SECRET);
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
          text: "You seem to have no transit keys here, would you like to create one?"
        }));
      } else {
        setErrorText(e.message);
      }
    }
  }

  get name() {
    return "Transit View";
  }
}
