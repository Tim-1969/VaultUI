import { getSealStatus } from "./api/getSealStatus";
import { lookupSelf } from "./api/lookupSelf";
import { makeElement } from "./htmlUtils";
import { pageState } from "./globalPageState.js";
import UIkit from 'uikit/dist/js/uikit.min.js';
import i18next from 'i18next';

async function prePageChecksReal() {
  if (pageState.language.length == 0) {
    changePage("SET_LANGUAGE");
    throw new Error("Language Not Set");
  }
  if (!pageState.apiURL) {
    changePage("SET_VAULT_URL");
    throw new Error("Vault URL Not Set");
  }

  let sealStatus = await getSealStatus();
  if (sealStatus.sealed) {
    changePage("UNSEAL");
    throw new Error("Vault Sealed");
  }

  try {
    await lookupSelf();
  } catch (e) {
    changePage("LOGIN")
    throw e;
  }
}

export async function prePageChecks() {
  try {
    await prePageChecksReal();
  } catch (e) {
    console.log("OHNO", e)
    return false;
  }
  return true;
}



export function addClipboardNotifications(clipboard, timeout = 1000) {
  clipboard.on('success', _ => {
    UIkit.notification(i18next.t("notification_copy_success"), {
      status: 'success',
      timeout: timeout
    });
  });
  clipboard.on('error', function (e) {
    UIkit.notification(i18next.t("notification_copy_error", {
      "error": e.message
    }), {
      status: 'danger',
      timeout: timeout
    });
  });
}

export function setErrorText(text) {
  let errorTextElement = document.querySelector("#errorText");
  if (errorTextElement) {
    document.querySelector("#errorText").innerText = `Error: ${text}`;
  }
  UIkit.notification({
    message: `Error: ${text}`,
    status: 'danger',
    pos: 'top-center',
    timeout: 2000
  });
}

export function changePage(page, shouldSwitch = true) {
  if (pageState.currentPage && shouldSwitch) {
    pageState.currentPage.cleanup();
  }
  pageState.currentPage = page;
  if (shouldSwitch) {
    renderPage();
  }
}

export function renderPage() {
  document.documentElement.dir = pageState.pageDirection;
  console.log("Rendering Page: ", pageState.currentPage.name);
  document.querySelector("#pageContent").innerHTML = "";
  setPageTitle(pageState.currentPage.name);
  pageState.currentPage.render();
}

export function setPageTitle(title) {
  let pageTitle = document.getElementById("pageTitle");
  pageTitle.innerHTML = "";
  if (typeof title === "string" || title instanceof String) {
    pageTitle.innerText = title;
  } else {
    pageTitle.appendChild(title);
  }
}

function currentTitleSecretText() {
  let currentSecretText = pageState.currentSecret;
  currentSecretText += pageState.currentPage.titleSuffix;

  if (pageState.currentSecretVersion !== null) currentSecretText += ` (v${pageState.currentSecretVersion})`;
  return currentSecretText;
}

export function setTitleElement(pageState) {
  const titleElement = makeElement({
    tag: "div",
    children: [
      makeElement({
        tag: "a",
        text: pageState.currentBaseMount + " ",
        onclick: _ => {
          pageState.currentSecretPath = [];
          pageState.currentSecret = "";
          pageState.currentSecretVersion = null;

          if (pageState.currentMountType.startsWith("kv") || pageState.currentMountType == "cubbyhole") {
            changePage("KEY_VALUE_VIEW");
          } else if (pageState.currentMountType == "totp") {
            changePage("TOTP");
          } else if (pageState.currentMountType == "transit") {
            changePage("TRANSIT_VIEW");
          }
        }
      }),
      ...pageState.currentSecretPath.map(function (secretPath, index, secretPaths) {
        return makeElement({
          tag: "a",
          text: secretPath + " ",
          onclick: _ => {
            pageState.currentSecretVersion = null;
            if (pageState.currentMountType.startsWith("kv")) {
              pageState.currentSecretPath = secretPaths.slice(0, index + 1);
              changePage("KEY_VALUE_VIEW");
            }
          }
        });
      }),
      makeElement({
        tag: "span",
        condition: pageState.currentSecret.length != 0,
        text: currentTitleSecretText()
      })
    ]
  });
  setPageTitle(titleElement);
  return titleElement;
}

export function setPageContent(content) {
  let pageContent = document.getElementById("pageContent");
  if (typeof content === "string" || content instanceof String) {
    pageContent.innerHTML = content;
  } else {
    pageContent.innerHTML = "";
    pageContent.appendChild(content);
  }
}