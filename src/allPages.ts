import { HomePage } from "./pages/Home";
import { KeyValueDeletePage } from "./pages/KeyValue/KeyValueDelete.js";
import { KeyValueNewPage } from "./pages/KeyValue/KeyValueNew.js";
import { KeyValueSecretEditPage } from "./pages/KeyValue/KeyValueSecretsEdit.js";
import { KeyValueSecretPage } from "./pages/KeyValue/KeyValueSecret.js";
import { KeyValueVersionsPage } from "./pages/KeyValue/KeyValueVersions.js";
import { KeyValueViewPage } from "./pages/KeyValue/KeyValueView.js";
import { LoginPage } from "./pages/Login";
import { MePage } from "./pages/Me";
import { NewTOTPPage } from "./pages/TOTP/NewTOTP.js";
import { Page } from "./types/Page";
import { PwGenPage } from "./pages/PwGen";
import { SetLanguagePage } from "./pages/SetLanguage";
import { SetVaultURLPage } from "./pages/SetVaultURL";
import { TOTPViewPage } from "./pages/TOTP/TOTPView.js";
import { TransitDecryptPage } from "./pages/Transit/TransitDecrypt.js";
import { TransitEncryptPage } from "./pages/Transit/TransitEncrypt.js";
import { TransitViewPage } from "./pages/Transit/TransitView.js";
import { TransitViewSecretPage } from "./pages/Transit/TransitViewSecret.js";
import { UnsealPage } from "./pages/Unseal";

type pagesList = {
  [key: string]: Page
}

export const allPages: pagesList = {
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