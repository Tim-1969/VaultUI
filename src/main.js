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

import { PageState } from "./PageState.js";
import {
  changePage,
  renderPage,
} from "./pageUtils.js";
import { getSealStatus } from './api.js';
import { makeElement } from "./htmlUtils.js";

// Pages

import {
  HomePage,
  KeyValueDeletePage,
  KeyValueNewPage,
  KeyValueSecretEditPage,
  KeyValueSecretPage,
  KeyValueVersionsPage,
  KeyValueViewPage,
  LoginPage,
  MePage,
  NewTOTPPage,
  PwGenPage,
  SetLanguagePage,
  SetVaultURLPage,
  TOTPViewPage,
  TransitDecryptPage,
  TransitEncryptPage,
  TransitViewPage,
  TransitViewSecretPage,
  UnsealPage,
} from "./pages";

const pages = {
  HOME: new HomePage(),
  ME: new MePage(),
  TOTP: new TOTPViewPage(),
  NEW_TOTP: new NewTOTPPage(),
  LOGIN: new LoginPage(),
  SET_VAULT_URL: new SetVaultURLPage(),
  UNSEAL: new UnsealPage(),
  SET_LANGUAGE: new SetLanguagePage(),
  TRANSIT_VIEW: new TransitViewPage(),
  TRANSIT_VIEW_SECRET: new TransitViewSecretPage(),
  TRANSIT_ENCRYPT: new TransitEncryptPage(),
  TRANSIT_DECRYPT: new TransitDecryptPage(),
  KEY_VALUE_VIEW: new KeyValueViewPage(),
  KEY_VALUE_SECRET: new KeyValueSecretPage(),
  KEY_VALUE_VERSIONS: new KeyValueVersionsPage(),
  KEY_VALUE_NEW_SECRET: new KeyValueNewPage(),
  KEY_VALUE_DELETE: new KeyValueDeletePage(),
  KEY_VALUE_SECRET_EDIT: new KeyValueSecretEditPage(),
  PW_GEN: new PwGenPage(),
};

// Translations
import {formatDistance} from './formatDistance.js';
import i18next from 'i18next';
import translation_de from './translations/de.js'
import translation_en from './translations/en.js'
import translation_fr from './translations/fr.js'
import translation_nl from './translations/nl.js'
import translation_ru from './translations/ru.js'


/*import "en-GB" as date_locale_en from 'date-fns/locale'

function getDateLocale() {
  let locales = {
    en:
  }
}*/


// Globals

var pageState = new PageState();
window.pageState = pageState;
window.realPages = pages;

function ListItem(children) {
  return makeElement({
    tag: "li",
    children: children
  });
}

function onLoad() {
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
              onclick: _ => { pageState.currentPage.goBack(); }
            })),
            ListItem(makeElement({
              tag: "a",
              text: i18next.t("refresh_btn"),
              onclick: _ => { changePage(pageState.currentPage); }
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

  window.pageContent = document.querySelector("#pageContent");
  renderPage();

  setInterval(async () => {
    if (pageState.currentPageString != "UNSEAL") {
      if (pageState.apiURL.length != 0) { return; }
      let sealStatus = await getSealStatus();
      if (sealStatus.sealed) {
        changePage("UNSEAL");
        return;
      }
    }
  }, 5000);
}

document.addEventListener('DOMContentLoaded', function () {
  i18next.init({
    lng: pageState.language,
    fallbackLng: 'en',
    debug: true,
    resources: {
      en: { translation: translation_en },
      de: { translation: translation_de },
      ru: { translation: translation_ru },
      nl: { translation: translation_nl },
      fr: { translation: translation_fr },
    },
    interpolation: {
      format: function (value, format, _) {
        if (format === 'until_date' && value instanceof Date) return formatDistance(new Date(), new Date(value));
        return value;
      }
    }
  }).then(function (_) {
    onLoad();
  });
}, false);
