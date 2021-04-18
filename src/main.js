'use strict';

// JS & CSS

import "./scss/main.scss";
import UIkit from 'uikit/dist/js/uikit.min.js';
import Icons from 'uikit/dist/js/uikit-icons.min.js';
UIkit.use(Icons);

import Prism from "prismjs";
import "prismjs/components/prism-json";
Prism.highlightAll();

import {
  changePage,
  renderPage,
} from "./pageUtils.js";
import { PageState } from "./PageState.js";
import { makeElement } from "./htmlUtils.js";
import { getSealStatus } from './api.js';

// Pages

import {
  HomePage,
  MePage,
  TOTPViewPage,
  NewTOTPPage,
  LoginPage,
  SetVaultURLPage,
  UnsealPage,
  TransitViewPage,
  TransitViewSecretPage,
  TransitEncryptPage,
  TransitDecryptPage,
  KeyValueViewPage,
  KeyValueSecretsPage,
  KeyValueVersionsPage,
  KeyValueNewPage,
  KeyValueDeletePage,
  KeyValueSecretsEditPage,
  PwGenPage,
} from "./pages";

const pages = {
  HOME: new HomePage(),
  ME: new MePage(),
  TOTP: new TOTPViewPage(),
  NEW_TOTP: new NewTOTPPage(),
  LOGIN: new LoginPage(),
  SET_VAULT_URL: new SetVaultURLPage(),
  UNSEAL: new UnsealPage(),
  TRANSIT_VIEW: new TransitViewPage(),
  TRANSIT_VIEW_SECRET: new TransitViewSecretPage(),
  TRANSIT_ENCRYPT: new TransitEncryptPage(),
  TRANSIT_DECRYPT: new TransitDecryptPage(),
  KEY_VALUE_VIEW: new KeyValueViewPage(),
  KEY_VALUE_SECRETS: new KeyValueSecretsPage(),
  KEY_VALUE_VERSIONS: new KeyValueVersionsPage(),
  KEY_VALUE_NEW_SECRET: new KeyValueNewPage(),
  KEY_VALUE_DELETE: new KeyValueDeletePage(),
  KEY_VALUE_SECRETS_EDIT: new KeyValueSecretsEditPage(),
  PW_GEN: new PwGenPage(),
};

// Translations
import i18next from 'i18next';
import translation_en from './translations/en.js'
import translation_de from './translations/de.js'
import formatDistance from 'date-fns/formatDistance';



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
    if (pageState.currentPage != "UNSEAL") {
      if (!localStorage.getItem('apiurl')) { return; }
      let sealStatus = await getSealStatus();
      if (sealStatus.sealed) {
        changePage("UNSEAL");
        return;
      }
    }
  }, 5000);
};

document.addEventListener('DOMContentLoaded', function () {
  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en: { translation: translation_en },
      de: { translation: translation_de },
    },
    interpolation: {
      format: function (value, format, _) {
        if (format === 'until_date' && value instanceof Date) return formatDistance(new Date(), new Date(value));
        return value;
      }
    }
  }).then(function (t) {
    onLoad();
  });
}, false);