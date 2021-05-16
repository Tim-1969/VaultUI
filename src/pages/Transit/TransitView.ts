import { DoesNotExistError } from "../../types/internalErrors";
import { Page } from "../../types/Page";
import { SecretTitleElement } from "../../elements/SecretTitleElement";
import { getTransitKeys } from "../../api/transit/getTransitKeys";
import { makeElement } from "z-makeelement";
import { setErrorText } from "../../pageUtils";
import i18next from "i18next";

export class TransitViewPage extends Page {
  constructor() {
    super();
  }

  async goBack(): Promise<void> {
    await this.router.changePage("HOME");
  }

  async render(): Promise<void> {
    this.state.currentSecret = "";

    const transitViewContent = makeElement({ tag: "div" });
    await this.router.setPageContent(transitViewContent);

    const newButton = makeElement({
      tag: "button",
      text: "New",
      class: ["uk-button", "uk-button-primary", "uk-margin-bottom"],
      onclick: async () => {
        await this.router.changePage("TRANSIT_NEW_KEY");
      },
    });
    transitViewContent.appendChild(newButton);

    try {
      const res = await getTransitKeys(this.state.currentBaseMount);

      transitViewContent.appendChild(
        makeElement({
          tag: "ul",
          class: ["uk-nav", "uk-nav-default"],
          children: [
            ...res.map((secret) => {
              return makeElement({
                tag: "li",
                children: makeElement({
                  tag: "a",
                  text: secret,
                  onclick: async () => {
                    this.state.currentSecret = secret;
                    await this.router.changePage("TRANSIT_VIEW_SECRET");
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

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router);
  }

  get name(): string {
    return i18next.t("transit_view_title");
  }
}
