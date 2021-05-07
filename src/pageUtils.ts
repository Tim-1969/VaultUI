import { Page } from "./types/Page";
import { PageState } from "./PageState";
import { getSealStatus } from "./api/getSealStatus";
import { lookupSelf } from "./api/lookupSelf";
import { makeElement } from "./htmlUtils";
import { pageState } from "./globalPageState";
import ClipboardJS from "clipboard";
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

  const sealStatus = await getSealStatus();
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

export async function prePageChecks(): Promise<boolean> {
  try {
    await prePageChecksReal();
  } catch (e) {
    console.log("OHNO", e)
    return false;
  }
  return true;
}



export function addClipboardNotifications(clipboard: ClipboardJS, timeout = 1000): void {
  clipboard.on('success', _ => {
    (UIkit as any).notification(i18next.t("notification_copy_success"), {
      status: 'success',
      timeout: timeout
    });
  });
  clipboard.on('error', function (e: Error) {
    (UIkit as any).notification(i18next.t("notification_copy_error", {
      "error": e.message
    }), {
      status: 'danger',
      timeout: timeout
    });
  });
}

export function setErrorText(text: string): void {
  const errorTextElement = document.querySelector("#errorText");
  if (errorTextElement) {
    (document.querySelector("#errorText") as HTMLElement).innerText = `Error: ${text}`;
  }
  (UIkit as any).notification({
    message: `Error: ${text}`,
    status: 'danger',
    pos: 'top-center',
    timeout: 2000
  });
}

export function changePage(page: string, shouldSwitch = true): void {
  if (pageState.currentPage && shouldSwitch) {
    (pageState.currentPage as Page).cleanup();
  }
  pageState.currentPage = page;
  if (shouldSwitch) {
    renderPage();
  }
}

export function renderPage(): void {
  document.documentElement.dir = pageState.pageDirection;
  console.log("Rendering Page: ", (pageState.currentPage as Page).name);
  (document.querySelector("#pageContent") as HTMLElement).innerHTML = "";
  setPageTitle((pageState.currentPage as Page).name);
  (pageState.currentPage as Page).render();
}

export function setPageTitle(title: string | HTMLElement): void {
  const pageTitle = (document.getElementById("pageTitle") as HTMLElement);
  pageTitle.innerHTML = "";
  if (typeof title === "string") {
    pageTitle.innerText = title.toString();
  } else {
    pageTitle.appendChild(title);
  }
}

function currentTitleSecretText() {
  let currentSecretText = pageState.currentSecret;
  currentSecretText += (pageState.currentPage as Page).titleSuffix;
  if (pageState.currentSecretVersion !== null) currentSecretText += ` (v${pageState.currentSecretVersion})`;
  return currentSecretText;
}

export function setTitleElement(pageState: PageState): void {
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
}

export function setPageContent(content: string | HTMLElement): void {
  const pageContent = (document.getElementById("pageContent") as HTMLElement);
  if (typeof content === "string") {
    pageContent.innerHTML = content;
  } else {
    pageContent.innerHTML = "";
    pageContent.appendChild(content);
  }
}