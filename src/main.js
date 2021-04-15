'use strict';

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

import {
  HomePage,
  TOTPViewPage,
  NewTOTPPage,
  LoginPage,
  SetVaultURLPage,
  UnsealPage,
  TransitViewPage,
  TransitViewSecretPage,
  KeyValueViewPage,
  KeyValueSecretsPage,
  KeyValueVersionsPage,
  KeyValueNewPage,
  KeyValueDeletePage,
  KeyValueSecretsEditPage,
  PwGenPage,
} from "./pages";

import { getSealStatus } from './api.js';

const pages = {
  HOME: new HomePage(),
  TOTP: new TOTPViewPage(),
  NEW_TOTP: new NewTOTPPage(),
  LOGIN: new LoginPage(),
  SET_VAULT_URL: new SetVaultURLPage(),
  UNSEAL: new UnsealPage(),
  TRANSIT_VIEW: new TransitViewPage(),
  TRANSIT_VIEW_SECRET: new TransitViewSecretPage(),
  KEY_VALUE_VIEW: new KeyValueViewPage(),
  KEY_VALUE_SECRETS: new KeyValueSecretsPage(),
  KEY_VALUE_VERSIONS: new KeyValueVersionsPage(),
  KEY_VALUE_NEW_SECRET: new KeyValueNewPage(),
  KEY_VALUE_DELETE: new KeyValueDeletePage(),
  KEY_VALUE_SECRETS_EDIT: new KeyValueSecretsEditPage(),
  PW_GEN: new PwGenPage(),
};

var pageState = new PageState();
window.pageState = pageState;
window.pages = pages;
// when making static html, make changePage global so it can be used with onclick
window.changePage = changePage;

document.addEventListener('DOMContentLoaded', function () {
  document.body.innerHTML += `
  <nav class="uk-navbar uk-navbar-container">
    <div class="uk-navbar-left">
        <ul class="uk-navbar-nav">
            <li><a onclick="changePage(pages.HOME);">Home</a></li>
            <li><a onclick="pageState.currentPage.goBack();">Back</a></li>
            <li class="uk-active"><a onclick="changePage(pageState.currentPage)">Refresh</a></li>
        </ul>
    </div>
  </nav>
  <div class="uk-container uk-container-medium uk-align-center">
    <div class="uk-card uk-card-body">
        <h3 class="uk-card-title" id="pageTitle">Title</h3>
        <div id="pageContent">
        </div>
    </div>
  </div>
  `;
  window.pageContent = document.querySelector("#pageContent");
  renderPage();

  setInterval(async () => {
    if (pageState.currentPage != pages.UNSEAL) {
      let sealStatus = await getSealStatus();
      if (sealStatus.sealed) {
        changePage(pages.UNSEAL);
        return;
      }
    }
  }, 5000);
}, false);