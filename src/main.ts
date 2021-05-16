"use strict";

// JS & CSS

/* eslint-disable */
import "./scss/main.scss";
import UIkit from 'uikit';
// Don't Sort These!
import Icons from 'uikit/dist/js/uikit-icons';
// @ts-ignore
UIkit.use(Icons);

import Prism from "prismjs";
// Don't Sort These!
import "prismjs/components/prism-json";

Prism.highlightAll();
/* eslint-enable */

// Actual Imports

import { NavBar } from "./elements/NavBar";
import { PageRouter } from "z-pagerouter";
import { pageList } from "./allPages";
import { formatDistance } from "./formatDistance";
import { getSealStatus } from "./api/sys/getSealStatus";
import { makeElement } from "./htmlUtils";
import { pageState } from "./globalPageState";
import { playground } from "./playground";
import i18next from "i18next";

// @ts-ignore
import translations from "./translations/index.mjs";

declare global {
  interface Window {
    pageContent: Element;
  }
}

async function onLoad(): Promise<void> {
  document.body.innerHTML = "";
  document.body.appendChild(makeElement({ tag: "div", id: "navBarReplace" }));
  document.body.appendChild(
    makeElement({
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
            text: "",
          }),
          makeElement({
            tag: "div",
            id: "pageContent",
          }),
        ],
      }),
    }),
  );

  window.pageContent = document.querySelector("#pageContent");

  const pageRouter = new PageRouter(
    pageList,
    pageState,
    document.getElementById("pageContent"),
    document.getElementById("pageTitle"),
  );

  document.querySelector("#navBarReplace").replaceWith(NavBar(pageRouter));

  pageRouter.addEventListener("pageChanged", async function (_) {
    pageState.currentPage = await pageRouter.getCurrentPageID();
    document.documentElement.dir = pageState.pageDirection;
  });

  if (process.env.NODE_ENV == "development") {
    await playground(pageRouter);
  }

  await pageRouter.changePage(pageState.currentPageString);

  setInterval(async () => {
    if ((await pageRouter.getCurrentPageID()) != "UNSEAL") {
      if (pageState.apiURL.length != 0) {
        return;
      }
      const sealStatus = await getSealStatus();
      if (sealStatus.sealed) {
        await pageRouter.changePage("UNSEAL");
        return;
      }
    }
  }, 5000);
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    console.log("Loading...");
    // @ts-expect-error
    console.log("Build Data:", BUILD_STRING);
    void i18next
      .init({
        lng: pageState.language,
        fallbackLng: "en",
        debug: true,
        // @ts-ignore
        resources: Object.fromEntries(
          Object.entries(translations).map(([k, v]) => [k, { translation: v }]),
        ),
        interpolation: {
          format: function (value: unknown, format, _): string {
            if (format === "until_date" && value instanceof Date)
              return formatDistance(new Date(), new Date(value), pageState.language);
            return value as string;
          },
        },
      })
      .then(function (_) {
        void onLoad();
      });
  },
  false,
);
