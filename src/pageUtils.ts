import { Page } from "./types/Page";
import { PageState } from "./PageState";
import { getSealStatus } from "./api/sys/getSealStatus";
import { lookupSelf } from "./api/sys/lookupSelf";
import { makeElement } from "./htmlUtils";
import { pageState } from "./globalPageState";
import ClipboardJS from "clipboard";
import UIkit from "uikit";
import i18next from "i18next";

async function prePageChecksReal() {
  if (pageState.language.length == 0) {
    await changePage("SET_LANGUAGE");
    throw new Error("Language Not Set");
  }
  if (!pageState.apiURL) {
    await changePage("SET_VAULT_URL");
    throw new Error("Vault URL Not Set");
  }

  const sealStatus = await getSealStatus();
  if (sealStatus.sealed) {
    await changePage("UNSEAL");
    throw new Error("Vault Sealed");
  }

  try {
    await lookupSelf();
  } catch (e) {
    await changePage("LOGIN");
    throw e;
  }
}

export async function prePageChecks(): Promise<boolean> {
  try {
    await prePageChecksReal();
  } catch (e) {
    console.log("OHNO", e);
    return false;
  }
  return true;
}

export function addClipboardNotifications(clipboard: ClipboardJS, timeout = 1000): void {
  clipboard.on("success", () => {
    UIkit.notification(i18next.t("notification_copy_success"), {
      status: "success",
      timeout: timeout,
    });
  });
  clipboard.on("error", function (e: Error) {
    UIkit.notification(
      i18next.t("notification_copy_error", {
        error: e.message,
      }),
      {
        status: "danger",
        timeout: timeout,
      },
    );
  });
}

export function setErrorText(text: string): void {
  const errorTextElement = document.querySelector("#errorText");
  if (errorTextElement) {
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    const p = document.querySelector("#errorText") as HTMLParagraphElement;
    p.innerText = `Error: ${text}`;
    /* eslint-enable @typescript-eslint/no-unnecessary-type-assertion */
  }
  UIkit.notification({
    message: `Error: ${text}`,
    status: "danger",
    pos: "top-center",
    timeout: 2000,
  });
}

export async function changePage(page: string): Promise<void> {
  if (pageState.currentPage) {
    await (pageState.currentPage as Page).cleanup();
  }
  pageState.currentPage = page;
  await renderPage();
}

export async function renderPage(): Promise<void> {
  document.documentElement.dir = pageState.pageDirection;
  console.log("Rendering Page: ", (pageState.currentPage as Page).name);
  document.querySelector("#pageContent").innerHTML = "";
  setPageTitle((pageState.currentPage as Page).name);
  await (pageState.currentPage as Page).render();
}

export function setPageTitle(title: string | HTMLElement): void {
  const pageTitle = document.getElementById("pageTitle");
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
  if (pageState.currentSecretVersion !== null)
    currentSecretText += ` (v${pageState.currentSecretVersion})`;
  return currentSecretText;
}

export function setTitleElement(pageState: PageState): void {
  const titleElement = makeElement({
    tag: "div",
    children: [
      makeElement({
        tag: "a",
        text: pageState.currentBaseMount + " ",
        onclick: async () => {
          pageState.currentSecretPath = [];
          pageState.currentSecret = "";
          pageState.currentSecretVersion = null;

          if (
            pageState.currentMountType.startsWith("kv") ||
            pageState.currentMountType == "cubbyhole"
          ) {
            await changePage("KEY_VALUE_VIEW");
          } else if (pageState.currentMountType == "totp") {
            await changePage("TOTP");
          } else if (pageState.currentMountType == "transit") {
            await changePage("TRANSIT_VIEW");
          }
        },
      }),
      ...pageState.currentSecretPath.map(function (secretPath, index, secretPaths) {
        return makeElement({
          tag: "a",
          text: secretPath + " ",
          onclick: async () => {
            pageState.currentSecretVersion = null;
            if (pageState.currentMountType.startsWith("kv")) {
              pageState.currentSecretPath = secretPaths.slice(0, index + 1);
              await changePage("KEY_VALUE_VIEW");
            }
          },
        });
      }),
      makeElement({
        tag: "span",
        condition: pageState.currentSecret.length != 0,
        text: currentTitleSecretText(),
      }),
    ],
  });
  setPageTitle(titleElement);
}

export function setPageContent(content: string | HTMLElement): void {
  const pageContent = document.getElementById("pageContent");
  if (typeof content === "string") {
    pageContent.innerHTML = content;
  } else {
    pageContent.innerHTML = "";
    pageContent.appendChild(content);
  }
}
