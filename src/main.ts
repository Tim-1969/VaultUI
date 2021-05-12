'use strict';

// JS & CSS

/* eslint-disable */
import "./scss/main.scss";
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
// @ts-ignore
UIkit.use(Icons);

import Prism from "prismjs";
// Don't Sort These!
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
import { formatDistance } from './formatDistance';
import i18next from 'i18next';
// @ts-ignore
import { TitleBar } from "./elements/TitleBar";
import translations from './translations/index.mjs';

declare global {
  interface Window { pageContent: Element; }
}


function onLoad(): void {
  document.body.innerHTML = "";
  document.body.appendChild(TitleBar());
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
