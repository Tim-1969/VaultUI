import { PageRouter } from "z-pagerouter";
import { getSealStatus } from "./api/sys/getSealStatus";
import { lookupSelf } from "./api/sys/lookupSelf";
import ClipboardJS from "clipboard";
import UIkit from "uikit";
import i18next from "i18next";
import { PageState } from "./PageState";

async function prePageChecksReal(router: PageRouter) {
  let state = router.state as PageState;
  if (state.language.length == 0) {
    await router.changePage("SET_LANGUAGE");
    throw new Error("Language Not Set");
  }
  if (!state.apiURL) {
    await router.changePage("SET_VAULT_URL");
    throw new Error("Vault URL Not Set");
  }

  const sealStatus = await getSealStatus();
  if (sealStatus.sealed) {
    await router.changePage("UNSEAL");
    throw new Error("Vault Sealed");
  }

  try {
    await lookupSelf();
  } catch (e) {
    await router.changePage("LOGIN");
    throw e;
  }
}

export async function prePageChecks(router: PageRouter): Promise<boolean> {
  try {
    await prePageChecksReal(router);
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
