'use strict';

// JS & CSS

import "./scss/main.scss";
import Icons from 'uikit/dist/js/uikit-icons.min.js';
import UIkit from 'uikit/dist/js/uikit.min.js';
UIkit.use(Icons);

/* eslint-disable */
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

function ListItem(children) {
  return makeElement({
    tag: "li",
    children: children
  });
}

async function onLoad() {
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
              onclick: _ => { changePage("HOME"); }
            })),
            ListItem(makeElement({
              tag: "a",
              text: i18next.t("back_btn"),
              onclick: _ => { (pageState.currentPage as Page).goBack(); }
            })),
            ListItem(makeElement({
              tag: "a",
              text: i18next.t("refresh_btn"),
              onclick: _ => { changePage(pageState.currentPageString); }
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
              onclick: _ => { changePage("ME"); }
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

  (window as any).pageContent = document.querySelector("#pageContent");

  if (process.env.NODE_ENV == "development") {
    await playground();
  }

  renderPage();

  setInterval(async () => {
    if (pageState.currentPageString != "UNSEAL") {
      if (pageState.apiURL.length != 0) { return; }
      const sealStatus = await getSealStatus();
      if (sealStatus.sealed) {
        changePage("UNSEAL");
        return;
      }
    }
  }, 5000);
}

document.addEventListener('DOMContentLoaded', async function () {
  console.log("Loading...");
  // @ts-expect-error
  console.log("Build Data:", BUILD_STRING);
  i18next.init({
    lng: pageState.language,
    fallbackLng: 'en',
    debug: true,
    // @ts-ignore
    resources: Object.fromEntries(Object.entries(translations).map(([k, v]) => [k, { translation: v }])),
    interpolation: {
      format: function (value, format, _) {
        if (format === 'until_date' && value instanceof Date) return formatDistance(new Date(), new Date(value));
        return value;
      }
    }
  }).then(async function (_) {
    await onLoad();
  });
}, false);
