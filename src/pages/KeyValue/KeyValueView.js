import { DoesNotExistError } from "../../types/internalErrors";
import { Page } from "../../types/Page";
import { changePage, setErrorText, setTitleElement } from "../../pageUtils";
import { getSecrets } from "../../api/getSecrets";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState.ts";
import i18next from 'i18next';


export class KeyValueViewPage extends Page {
  constructor() {
    super();
  }
  goBack() {
    if (pageState.currentSecretPath.length != 0) {
      pageState.popCurrentSecretPath();
      changePage("KEY_VALUE_VIEW");
    } else {
      changePage("HOME");
    }
  }
  async render() {
    pageState.currentSecret = "";

    setTitleElement(pageState);

    if (pageState.currentMountType == "cubbyhole") {
      pageContent.appendChild(makeElement({
        tag: "p",
        text: i18next.t("kv_view_cubbyhole_text"),
      }));
    }

    let newButton = makeElement({
      tag: "button",
      text: i18next.t("kv_view_new_btn"),
      class: ["uk-button", "uk-button-primary", "uk-margin-bottom"],
      onclick: () => {
        changePage("KEY_VALUE_NEW_SECRET");
      }
    });
    pageContent.appendChild(newButton);

    try {
      let res = await getSecrets(
        pageState.currentBaseMount,
        pageState.currentMountType,
        pageState.currentSecretPath,
      );

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
    } catch (e) {
      if (e == DoesNotExistError) {
        // getSecrets also 404's on no keys so dont go all the way back.
        if (pageState.currentSecretPath.length != 0) {
          return this.goBack();
        } else {
          pageContent.appendChild(makeElement({
            tag: "p",
            text: i18next.t("kv_view_none_here_text")
          }));
        }
      } else {
        setErrorText(e.message);
      }
    }
  }

  get name() {
    return i18next.t("kv_view_title");
  }
}
