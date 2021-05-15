import { PageRouter } from "../PageSystem/PageRouter";
import { makeElement } from "../htmlUtils";

function currentTitleSecretText(router: PageRouter, suffix = ""): string {
  let currentSecretText = router.state.currentSecret;
  currentSecretText += suffix;
  if (router.state.currentSecretVersion !== null)
    currentSecretText += ` (v${router.state.currentSecretVersion})`;
  return currentSecretText;
}

export async function SecretTitleElement(router: PageRouter, suffix = ""): Promise<HTMLElement> {
  const titleElement = makeElement({
    tag: "div",
    children: [
      makeElement({
        tag: "a",
        text: router.state.currentBaseMount + " ",
        onclick: async () => {
          router.state.currentSecretPath = [];
          router.state.currentSecret = "";
          router.state.currentSecretVersion = null;

          if (
            router.state.currentMountType.startsWith("kv") ||
            router.state.currentMountType == "cubbyhole"
          ) {
            await router.changePage("KEY_VALUE_VIEW");
          } else if (router.state.currentMountType == "totp") {
            await router.changePage("TOTP");
          } else if (router.state.currentMountType == "transit") {
            await router.changePage("TRANSIT_VIEW");
          }
        },
      }),
      ...router.state.currentSecretPath.map((secretPath, index, secretPaths) => {
        return makeElement({
          tag: "a",
          text: secretPath + " ",
          onclick: async () => {
            router.state.currentSecretVersion = null;
            if (router.state.currentMountType.startsWith("kv")) {
              router.state.currentSecretPath = secretPaths.slice(0, index + 1);
              await router.changePage("KEY_VALUE_VIEW");
            }
          },
        });
      }),
      makeElement({
        tag: "span",
        condition: router.state.currentSecret.length != 0,
        text: currentTitleSecretText(router, suffix),
      }),
    ],
  });
  return titleElement;
}
