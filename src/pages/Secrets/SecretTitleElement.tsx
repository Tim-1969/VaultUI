import { JSX } from "preact/jsx-runtime";
import { PageRouter } from "z-pagerouter";
import { PageState } from "../../state/PageState";

function currentTitleSecretText(state: PageState): string {
  let secretItemText = state.secretItem;
  if (state.secretVersion !== null) secretItemText += ` (v${state.secretVersion})`;
  return secretItemText;
}

type SecretTitleElementProps = {
  router: PageRouter;
  suffix?: string;
};

export function SecretTitleElement(props: SecretTitleElementProps): JSX.Element {
  const router = props.router;
  const suffix = props.suffix || "";
  const state = router.state as PageState;

  return (
    <div>
      <a
        onClick={async () => {
          await router.changePage("SECRETS_HOME");
        }}
      >
        {"/ "}
      </a>

      <a
        onClick={async () => {
          state.secretPath = [];
          state.secretItem = "";
          state.secretVersion = null;

          if (state.secretMountType.startsWith("kv") || state.secretMountType == "cubbyhole") {
            await router.changePage("KEY_VALUE_VIEW");
          } else if (state.secretMountType == "totp") {
            await router.changePage("TOTP_VIEW");
          } else if (state.secretMountType == "transit") {
            await router.changePage("TRANSIT_VIEW");
          }
        }}
      >
        {state.baseMount + " "}
      </a>
      {...state.secretPath.map((secretPath, index, secretPaths) => (
        <a
          onClick={async () => {
            state.secretVersion = null;
            if (state.secretMountType.startsWith("kv")) {
              state.secretPath = secretPaths.slice(0, index + 1);
              await router.changePage("KEY_VALUE_VIEW");
            }
          }}
        >
          {secretPath + " "}
        </a>
      ))}
      {state.secretItem.length != 0 && <span>{currentTitleSecretText(state)}</span>}
      {suffix.length != 0 && <span>{suffix}</span>}
    </div>
  );
}
