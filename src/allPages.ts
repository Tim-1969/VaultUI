import { HomePage } from "./pages/Home";
import { KeyValueDeletePage } from "./pages/Secrets/KeyValue/KeyValueDelete";
import { KeyValueNewPage } from "./pages/Secrets/KeyValue/KeyValueNew";
import { KeyValueSecretEditPage } from "./pages/Secrets/KeyValue/KeyValueSecretsEdit";
import { KeyValueSecretPage } from "./pages/Secrets/KeyValue/KeyValueSecret";
import { KeyValueVersionsPage } from "./pages/Secrets/KeyValue/KeyValueVersions";
import { KeyValueViewPage } from "./pages/Secrets/KeyValue/KeyValueView";
import { LoginPage } from "./pages/Login";
import { MePage } from "./pages/Me";
import { NewKVEnginePage } from "./pages/Secrets/NewEngines/NewKVEngine";
import { NewSecretsEnginePage } from "./pages/Secrets/NewSecretsEngine";
import { NewTOTPEnginePage } from "./pages/Secrets/NewEngines/NewTOTPEngine";
import { NewTOTPPage } from "./pages/Secrets/TOTP/NewTOTP";
import { NewTransitEnginePage } from "./pages/Secrets/NewEngines/NewTransitEngine";
import { NewTransitKeyPage } from "./pages/Secrets/Transit/NewTransitKey";
import { Page } from "./types/Page";
import { PwGenPage } from "./pages/PwGen";
import { SecretsHomePage } from "./pages/Secrets/SecretsHome";
import { SetLanguagePage } from "./pages/SetLanguage";
import { SetVaultURLPage } from "./pages/SetVaultURL";
import { TOTPViewPage } from "./pages/Secrets/TOTP/TOTPView";
import { TransitDecryptPage } from "./pages/Secrets/Transit/TransitDecrypt";
import { TransitEncryptPage } from "./pages/Secrets/Transit/TransitEncrypt";
import { TransitRewrapPage } from "./pages/Secrets/Transit/TransitRewrap";
import { TransitViewPage } from "./pages/Secrets/Transit/TransitView";
import { TransitViewSecretPage } from "./pages/Secrets/Transit/TransitViewSecret";
import { UnsealPage } from "./pages/Unseal";
import { getObjectKeys } from "./utils";
import { AccessHomePage } from "./pages/Access/AccessHome";


/* eslint-disable */
import { PageType } from "z-pagerouter";
import { AuthHomePage } from "./pages/Access/Auth/AuthHome";
/* eslint-enable */

type pagesList = {
  [key: string]: Page;
};

export const allPages: pagesList = {
  HOME: new HomePage(),
  SECRETS_HOME: new SecretsHomePage(),
  ACCESS_HOME: new AccessHomePage(),
  AUTH_HOME: new AuthHomePage(),
  ME: new MePage(),
  TOTP: new TOTPViewPage(),
  NEW_TOTP: new NewTOTPPage(),
  LOGIN: new LoginPage(),
  SET_VAULT_URL: new SetVaultURLPage(),
  UNSEAL: new UnsealPage(),
  SET_LANGUAGE: new SetLanguagePage(),
  TRANSIT_NEW_KEY: new NewTransitKeyPage(),
  TRANSIT_VIEW: new TransitViewPage(),
  TRANSIT_VIEW_SECRET: new TransitViewSecretPage(),
  TRANSIT_ENCRYPT: new TransitEncryptPage(),
  TRANSIT_DECRYPT: new TransitDecryptPage(),
  TRANSIT_REWRAP: new TransitRewrapPage(),
  KEY_VALUE_VIEW: new KeyValueViewPage(),
  KEY_VALUE_SECRET: new KeyValueSecretPage(),
  KEY_VALUE_VERSIONS: new KeyValueVersionsPage(),
  KEY_VALUE_NEW_SECRET: new KeyValueNewPage(),
  KEY_VALUE_DELETE: new KeyValueDeletePage(),
  KEY_VALUE_SECRET_EDIT: new KeyValueSecretEditPage(),
  PW_GEN: new PwGenPage(),
  NEW_SECRETS_ENGINE: new NewSecretsEnginePage(),
  NEW_KV_ENGINE: new NewKVEnginePage(),
  NEW_TOTP_ENGINE: new NewTOTPEnginePage(),
  NEW_TRANSIT_ENGINE: new NewTransitEnginePage(),
};

// This should implement all o PageListType
class PageList {
  constructor(pages: pagesList) {
    this.pages = pages;
  }
  private pages: pagesList;

  async getPageIDs(): Promise<string[]> {
    return getObjectKeys(this.pages);
  }
  async getPage(pageID: string): Promise<PageType> {
    return this.pages[pageID];
  }
}

export const pageList = new PageList(allPages);
