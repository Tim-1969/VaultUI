import { ListItem } from "./ListItem";
import { Page } from "../types/Page";
import { changePage } from "../pageUtils";
import { makeElement } from "../htmlUtils";
import { pageState } from "../globalPageState";
import i18next from "i18next";

export function NavBar(): HTMLElement {
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
            ListItem(makeElement({
              tag: "a",
              text: i18next.t("home_btn"),
              onclick: () => { changePage("HOME"); }
            })),
            ListItem(makeElement({
              tag: "a",
              text: i18next.t("back_btn"),
              onclick: () => { (pageState.currentPage as Page).goBack(); }
            })),
            ListItem(makeElement({
              tag: "a",
              text: i18next.t("refresh_btn"),
              onclick: () => { changePage(pageState.currentPageString); }
            })),
          ]
        })
      }),
      makeElement({
        tag: "div",
        class: "uk-navbar-right",
        children: makeElement({
          tag: "ul",
          class: "uk-navbar-nav",
          children: [
            ListItem(makeElement({
              tag: "a",
              text: i18next.t("me_btn"),
              onclick: () => { changePage("ME"); }
            }))
          ]
        })
      })
    ]
  })
}

export function reloadNavBar(): void {
  document.querySelector("#navBar").replaceWith(NavBar());
}

