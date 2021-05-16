import { Page } from "./types/Page";
import { getObjectKeys } from "./utils";

/* eslint-disable */
import { PageType } from "z-pagerouter";
/* eslint-enable */

type importType = Promise<{
  default: { new (...args: unknown[]): Page };
}>;

type pagesList = {
  [key: string]: importType;
};

export const allPages: pagesList = {
  HOME: import("./pages/Home"),
  ME: import("./pages/Me"),
  TOTP: import("./pages/TOTP/TOTPView"),
  NEW_TOTP: import("./pages/TOTP/NewTOTP"),
  LOGIN: import("./pages/Login"),
  SET_VAULT_URL: import("./pages/SetVaultURL"),
  UNSEAL: import("./pages/Unseal"),
  SET_LANGUAGE: import("./pages/SetLanguage"),
  TRANSIT_NEW_KEY: import("./pages/Transit/NewTransitKey"),
  TRANSIT_VIEW: import("./pages/Transit/TransitView"),
  TRANSIT_VIEW_SECRET: import("./pages/Transit/TransitViewSecret"),
  TRANSIT_ENCRYPT: import("./pages/Transit/TransitEncrypt"),
  TRANSIT_DECRYPT: import("./pages/Transit/TransitDecrypt"),
  TRANSIT_REWRAP: import("./pages/Transit/TransitRewrap"),
  KEY_VALUE_VIEW: import("./pages/KeyValue/KeyValueView"),
  KEY_VALUE_SECRET: import("./pages/KeyValue/KeyValueSecret"),
  KEY_VALUE_VERSIONS: import("./pages/KeyValue/KeyValueVersions"),
  KEY_VALUE_NEW_SECRET: import("./pages/KeyValue/KeyValueNew"),
  KEY_VALUE_DELETE: import("./pages/KeyValue/KeyValueDelete"),
  KEY_VALUE_SECRET_EDIT: import("./pages/KeyValue/KeyValueSecretsEdit"),
  PW_GEN: import("./pages/PwGen"),
  NEW_SECRETS_ENGINE: import("./pages/NewSecretsEngine"),
  NEW_KV_ENGINE: import("./pages/NewEngines/NewKVEngine"),
  NEW_TOTP_ENGINE: import("./pages/NewEngines/NewTOTPEngine"),
  NEW_TRANSIT_ENGINE: import("./pages/NewEngines/NewTransitEngine"),
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
    return new (await this.pages[pageID]).default();
  }
}

export const pageList = new PageList(allPages);
