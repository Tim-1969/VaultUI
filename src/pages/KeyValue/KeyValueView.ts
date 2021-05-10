import { DoesNotExistError } from "../../types/internalErrors";
import { Page } from "../../types/Page";
import { changePage, setErrorText, setPageContent, setTitleElement } from "../../pageUtils";
import { getSecrets } from "../../api/kv/getSecrets";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import i18next from 'i18next';


export class KeyValueViewPage extends Page {
  constructor() {
    super();
  }
  goBack(): void {
    if (pageState.currentSecretPath.length != 0) {
      pageState.popCurrentSecretPath();
      changePage("KEY_VALUE_VIEW");
    } else {
      changePage("HOME");
    }
  }
  async render(): Promise<void> {
    pageState.currentSecret = "";

    setTitleElement(pageState);

    const kvViewPageContent = makeElement({ tag: "div" });
    setPageContent(kvViewPageContent);

    if (pageState.currentMountType == "cubbyhole") {
      kvViewPageContent.appendChild(makeElement({
        tag: "p",
        text: i18next.t("kv_view_cubbyhole_text"),
      }));
    }

    const newButton = makeElement({
      tag: "button",
      text: i18next.t("kv_view_new_btn"),
      class: ["uk-button", "uk-button-primary", "uk-margin-bottom"],
      onclick: () => {
        changePage("KEY_VALUE_NEW_SECRET");
      }
    });
    kvViewPageContent.appendChild(newButton);

    try {
      const res = await getSecrets(
        pageState.currentBaseMount,
        pageState.currentMountType,
        pageState.currentSecretPath,
      );

      kvViewPageContent.appendChild(makeElement({
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
                  if (secret.endsWith("/")) {
                    pageState.pushCurrentSecretPath(secret);
                    changePage("KEY_VALUE_VIEW");
                  } else {
                    pageState.currentSecret = secret;
                    changePage("KEY_VALUE_SECRET");
                  }
                }
              })
            });
          })
        ]
      }));
    } catch (e: unknown) {
      const error = e as Error;
      if (error == DoesNotExistError) {
        // getSecrets also 404's on no keys so dont go all the way back.
        if (pageState.currentSecretPath.length != 0) {
          return this.goBack();
        } else {
          kvViewPageContent.appendChild(makeElement({
            tag: "p",
            text: i18next.t("kv_view_none_here_text")
          }));
        }
      } else {
        setErrorText(error.message);
      }
    }
  }

  get name(): string {
    return i18next.t("kv_view_title");
  }
}
