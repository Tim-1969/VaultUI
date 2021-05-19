import { PageRouter } from "z-pagerouter";
import { PageState } from "../../PageState";
import { makeElement } from "z-makeelement";

function currentTitleSecretText(state: PageState, suffix = ""): string {
  let currentSecretText = state.currentSecret;
  currentSecretText += suffix;
  if (state.currentSecretVersion !== null) currentSecretText += ` (v${state.currentSecretVersion})`;
  return currentSecretText;
}

export async function SecretTitleElement(router: PageRouter, suffix = ""): Promise<HTMLElement> {
  const state = router.state as PageState;
  const titleElement = makeElement({
    tag: "div",
    children: [
      makeElement({
        tag: "a",
        text: state.currentBaseMount + " ",
        onclick: async () => {
          state.currentSecretPath = [];
          state.currentSecret = "";
          state.currentSecretVersion = null;

          if (state.currentMountType.startsWith("kv") || state.currentMountType == "cubbyhole") {
            await router.changePage("KEY_VALUE_VIEW");
          } else if (state.currentMountType == "totp") {
            await router.changePage("TOTP");
          } else if (state.currentMountType == "transit") {
            await router.changePage("TRANSIT_VIEW");
          }
        },
      }),
      ...state.currentSecretPath.map((secretPath, index, secretPaths) => {
        return makeElement({
          tag: "a",
          text: secretPath + " ",
          onclick: async () => {
            state.currentSecretVersion = null;
            if (state.currentMountType.startsWith("kv")) {
              state.currentSecretPath = secretPaths.slice(0, index + 1);
              await router.changePage("KEY_VALUE_VIEW");
            }
          },
        });
      }),
      makeElement({
        tag: "span",
        condition: state.currentSecret.length != 0,
        text: currentTitleSecretText(state, suffix),
      }),
    ],
  });
  return titleElement;
}
