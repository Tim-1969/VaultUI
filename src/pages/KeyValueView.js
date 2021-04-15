import { Page } from "../types/Page.js";
import { DoesNotExistError, getSecrets } from "../api.js";
import { setErrorText, setTitleElement } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";

export class KeyValueViewPage extends Page {
    constructor() {
        super();
    }
    goBack() {
        if (pageState.currentSecretPath.length != 0) {
            pageState.popCurrentSecretPath();
            changePage(pages.KEY_VALUE_VIEW);
        } else {
            changePage(pages.HOME);
        }
    }
    async render() {
        pageState.currentSecret = "";

        setTitleElement(pageState);

        let newButton = makeElement({
            tag: "button",
            text: "New",
            class: ["uk-button", "uk-button-primary", "uk-margin-bottom"],
            onclick: () => {
                changePage(pages.KEY_VALUE_NEW_SECRET);
            }
        });
        pageContent.appendChild(newButton);

        try {
            let res = await getSecrets(pageState.currentBaseMount, pageState.currentSecretPath);

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
                                        changePage(pages.KEY_VALUE_VIEW);
                                    } else {
                                        pageState.currentSecret = secret;
                                        changePage(pages.KEY_VALUE_SECRETS);
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
                        text: "You seem to have no secrets here, would you like to create one?"
                    }));
                }
            } else {
                setErrorText(e.message);
            }
        };
    }

    get name() {
        return "K/V View";
    }
}
