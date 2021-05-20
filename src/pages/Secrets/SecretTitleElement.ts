import { PageRouter } from "z-pagerouter";
import { PageState } from "../../PageState";
import { makeElement } from "z-makeelement";

function currentTitleSecretText(state: PageState, suffix = ""): string {
  let secretItemText = state.secretItem;
  secretItemText += suffix;
  if (state.secretVersion !== null) secretItemText += ` (v${state.secretVersion})`;
  return secretItemText;
}

export async function SecretTitleElement(router: PageRouter, suffix = ""): Promise<HTMLElement> {
  const state = router.state as PageState;
  const titleElement = makeElement({
    tag: "div",
    children: [
      makeElement({
        tag: "a",
        text: state.baseMount + " ",
        onclick: async () => {
          state.secretPath = [];
          state.secretItem = "";
          state.secretVersion = null;

          if (state.secretMountType.startsWith("kv") || state.secretMountType == "cubbyhole") {
            await router.changePage("KEY_VALUE_VIEW");
          } else if (state.secretMountType == "totp") {
            await router.changePage("TOTP");
          } else if (state.secretMountType == "transit") {
            await router.changePage("TRANSIT_VIEW");
          }
        },
      }),
      ...state.secretPath.map((secretPath, index, secretPaths) => {
        return makeElement({
          tag: "a",
          text: secretPath + " ",
          onclick: async () => {
            state.secretVersion = null;
            if (state.secretMountType.startsWith("kv")) {
              state.secretPath = secretPaths.slice(0, index + 1);
              await router.changePage("KEY_VALUE_VIEW");
            }
          },
        });
      }),
      makeElement({
        tag: "span",
        condition: state.secretItem.length != 0,
        text: currentTitleSecretText(state, suffix),
      }),
    ],
  });
  return titleElement;
}
