# VaultUI
![CI Status](https://ci.phoenix.qcx.io/api/v1/teams/phoenix/pipelines/vaultui/badge)

This is a very simple UI for working with secrets in [Hashicorp Vault](https://www.hashicorp.com/products/vault)

## How to build:
```
npm install --save-dev
npx webpack
```
The resulting built files will be in `dist/`

## How to run in development:
Use whatever browser you want, I personally test on latest Microsoft Edge Dev build.
```
npm install --save-dev
WEBPACK_MODE=development BROWSER=google-chrome npx webpack serve
```

## Translating
Make sure to keep the order of comments and tags in the translation files `src/translations` the same.

When you want to PR an update, title it "Changed wording in..." or "Synced translations in de" or something along those lines.

To get a list of what languages need what translations added, run `node ./checkTranslations.mjs`
Example:
```
Language: fr
Missing:  unseal_input_btn, unseal_qr_btn
```
Means those two missing things need to be added to french.


f
## Screenshots
### Home
![The home page with listings for all mounted secrets engines.](screenshots/home.jpg)
### Cubbyhole Engine
![The cubbyhole page with info on how to use it.](screenshots/cubbyhole.jpg)
### K/V v1 Engine
![The view screen on the key value v1 screen with delete and edit buttons.](screenshots/kv1.jpg)
### K/V v2 Engine
![The view screen on the key value v2 screen with delete all, edit and versions buttons.](screenshots/kv2.jpg)
![Viewing a secret that can only be displayed as syntax highlighted JSON.](screenshots/kv2json.jpg)
![The versions list of a secret.](screenshots/kv2versions.jpg)
![A soft deleted secret with option to undelete.](screenshots/kv2undelete.jpg)
### TOTP Engine
We don't yet support `generate: true` TOTP secrets but probably will in the future.
![A copyable list of TOTP codes with option to add a new one.](screenshots/totp.jpg)
![A screen where you can add a new TOTP code.](screenshots/totpnew.jpg)
### Transit Engine
![Options to encrypt and decrypt using the transit engine.](screenshots/transit.jpg)
