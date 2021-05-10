'use strict';

// JS & CSS

/* eslint-disable */
import "./scss/main.scss";
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
// @ts-ignore
UIkit.use(Icons);

import Prism from "prismjs";
import "prismjs/components/prism-json";
Prism.highlightAll();
/* eslint-enable */

import {
  changePage,
  renderPage,
} from "./pageUtils";
import { getSealStatus } from "./api/sys/getSealStatus";
import { makeElement } from "./htmlUtils";
import { pageState } from "./globalPageState";
import { playground } from "./playground";

// Translations
import { Page } from "./types/Page";
import { formatDistance } from './formatDistance';
import i18next from 'i18next';
// @ts-ignore
import translations from './translations/index.mjs'

function ListItem(children: Element[] | Element): HTMLElement {
  return makeElement({
    tag: "li",
    children: children
  });
}

declare global {
  interface Window { pageContent: Element; }
}


function onLoad(): void {
  document.body.innerHTML = "";
  document.body.appendChild(makeElement({
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
  }));
  document.body.appendChild(makeElement({
    tag: "div",
    class: ["uk-container", "uk-container-medium", "uk-align-center"],
    children: makeElement({
      tag: "div",
      class: ["uk-card", "uk-card-body"],
      children: [
        makeElement({
          tag: "h3",
          class: "uk-card-title",
          id: "pageTitle",
          text: ""
        }),
        makeElement({
          tag: "div",
          id: "pageContent"
        })
      ]
    })
  }));

  window.pageContent = document.querySelector("#pageContent");

  if (process.env.NODE_ENV == "development") {
    playground();
  }

  renderPage();

  setInterval(() => {
    if (pageState.currentPageString != "UNSEAL") {
      if (pageState.apiURL.length != 0) { return; }
      void getSealStatus().then((sealStatus) => {
        if (sealStatus.sealed) {
          changePage("UNSEAL");
          return;
        }        
      });
    }
  }, 5000);
}

document.addEventListener('DOMContentLoaded', function () {
  console.log("Loading...");
  // @ts-expect-error
  console.log("Build Data:", BUILD_STRING);
  void i18next.init({
    lng: pageState.language,
    fallbackLng: 'en',
    debug: true,
    // @ts-ignore
    resources: Object.fromEntries(Object.entries(translations).map(([k, v]) => [k, { translation: v }])),
    interpolation: {
      format: function (value: unknown, format, _): string {
        if (format === 'until_date' && value instanceof Date) return formatDistance(new Date(), new Date(value));
        return value as string;
      }
    }
  }).then(function (_) {
    onLoad();
  });
}, false);
