import { DoesNotExistError } from "../../types/internalErrors";
import { Page } from "../../types/Page";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { getTransitKeys } from "../../api/transit/getTransitKeys";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import i18next from "i18next";

export class TransitViewPage extends Page {
  constructor() {
    super();
  }

  async goBack(): Promise<void> {
    await changePage("HOME");
  }

  async render(): Promise<void> {
    pageState.currentSecret = "";

    setTitleElement(pageState);

    const transitViewContent = makeElement({ tag: "div" });
    setPageContent(transitViewContent);

    const newButton = makeElement({
      tag: "button",
      text: "New",
      class: ["uk-button", "uk-button-primary", "uk-margin-bottom"],
      onclick: () => {
        void changePage("TRANSIT_NEW_KEY");
      },
    });
    transitViewContent.appendChild(newButton);

    try {
      const res = await getTransitKeys(pageState.currentBaseMount);

      transitViewContent.appendChild(
        makeElement({
          tag: "ul",
          class: ["uk-nav", "uk-nav-default"],
          children: [
            ...res.map(function (secret) {
              return makeElement({
                tag: "li",
                children: makeElement({
                  tag: "a",
                  text: secret,
                  onclick: () => {
                    pageState.currentSecret = secret;
                    void changePage("TRANSIT_VIEW_SECRET");
                  },
                }),
              });
            }),
          ],
        }),
      );
    } catch (e: unknown) {
      const error = e as Error;
      if (error == DoesNotExistError) {
        transitViewContent.appendChild(
          makeElement({
            tag: "p",
            text: i18next.t("transit_view_none_here_text"),
          }),
        );
      } else {
        setErrorText(error.message);
      }
    }
  }

  get name(): string {
    return i18next.t("transit_view_title");
  }
}
