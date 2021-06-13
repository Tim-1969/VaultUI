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
import "prismjs/components/prism-hcl";

Prism.highlightAll();
/* eslint-enable */

// @ts-ignore
import translations from "./translations/index.mjs";

// Actual Imports
import { PageRouter } from "z-pagerouter";
import { formatDistance } from "./formatDistance";
import { getSealStatus } from "./api/sys/getSealStatus";
import { pageList } from "./allPages";
import { pageState } from "./globalPageState";
import { playground } from "./playground";
import { reloadNavBar } from "./elements/NavBar";
import { render } from "preact";
import i18next from "i18next";

async function onLoad(): Promise<void> {
  render(
    <>
      <div id="navBarBox" />
      <div class="uk-container uk-container-medium uk-align-center">
        <div class="uk-card uk-card-body">
          <h3 class="uk-card-title" id="pageTitle" />
          <div id="pageContent" />
        </div>
      </div>
    </>,
    document.body,
  );

  const pageRouter = new PageRouter({
    pageList: pageList,
    state: pageState,
    pageTitleElement: document.querySelector("#pageTitle"),
    pageContentElement: document.querySelector("#pageContent"),
    resetElementContent: !true,
    onPageChanged: async function (_) {
      pageState.currentPage = await pageRouter.getCurrentPageID();
      document.documentElement.dir = pageState.pageDirection;
    },
  });

  reloadNavBar(pageRouter);

  if (process.env.NODE_ENV == "development") {
    await playground(pageRouter);
  }

  await pageRouter.changePage(pageState.currentPage);

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
  async () => {
    console.log("Loading...");
    // @ts-expect-error
    console.log("Build Data:", BUILD_STRING);
    await i18next.init({
      lng: pageState.language,
      fallbackLng: "en",
      debug: true,
      // @ts-ignore
      resources: Object.fromEntries(
        Object.entries(translations).map(([k, v]) => [k, { translation: v }]),
      ),
      interpolation: {
        escape: (str) => {
          return str;
        },
        format: function (value: unknown, format, _): string {
          if (format === "until_date" && value instanceof Date)
            return formatDistance(new Date(), new Date(value), pageState.language);
          return value as string;
        },
      },
    });
    await onLoad();
  },
  false,
);
