import { ListItem } from "./ListItem";
import { makeElement } from "../htmlUtils";
import i18next from "i18next";
import { PageRouter } from "../PageSystem/PageRouter";

export function NavBar(router: PageRouter): HTMLElement {
  return makeElement({
    id: "navBar",
    tag: "nav",
    class: ["uk-navbar", "uk-navbar-container"],
    children: [
      makeElement({
        tag: "div",
        class: "uk-navbar-left",
        children: makeElement({
          tag: "ul",
          class: "uk-navbar-nav",
          children: [
            ListItem(
              makeElement({
                tag: "a",
                text: i18next.t("home_btn"),
                onclick: async () => {
                  await router.changePage("HOME");
                },
              }),
            ),
            ListItem(
              makeElement({
                tag: "a",
                text: i18next.t("back_btn"),
                onclick: async () => {
                  await router.goBack();
                },
              }),
            ),
            ListItem(
              makeElement({
                tag: "a",
                text: i18next.t("refresh_btn"),
                onclick: async () => {
                  await router.refresh();
                },
              }),
            ),
          ],
        }),
      }),
      makeElement({
        tag: "div",
        class: "uk-navbar-right",
        children: makeElement({
          tag: "ul",
          class: "uk-navbar-nav",
          children: [
            ListItem(
              makeElement({
                tag: "a",
                text: i18next.t("me_btn"),
                onclick: async () => {
                  await router.changePage("ME");
                },
              }),
            ),
          ],
        }),
      }),
    ],
  });
}

export function reloadNavBar(router: PageRouter): void {
  document.querySelector("#navBar").replaceWith(NavBar(router));
}
