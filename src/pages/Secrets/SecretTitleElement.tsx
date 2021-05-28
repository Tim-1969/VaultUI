import { JSX } from "preact/jsx-runtime";
import { Page } from "../../types/Page";

function currentTitleSecretText(page: Page): string {
  let secretItemText = page.state.secretItem;
  if (page.state.secretVersion !== null) secretItemText += ` (v${page.state.secretVersion})`;
  return secretItemText;
}

type SecretTitleElementProps = {
  page: Page;
  suffix?: string;
};

export function SecretTitleElement(props: SecretTitleElementProps): JSX.Element {
  const page = props.page;
  const suffix = props.suffix || "";

  return (
    <div>
      <a
        onClick={async () => {
          await page.router.changePage("SECRETS_HOME");
        }}
      >
        {"/ "}
      </a>

      <a
        onClick={async () => {
          page.state.secretPath = [];
          page.state.secretItem = "";
          page.state.secretVersion = null;

          if (
            page.state.secretMountType.startsWith("kv") ||
            page.state.secretMountType == "cubbyhole"
          ) {
            await page.router.changePage("KEY_VALUE_VIEW");
          } else if (page.state.secretMountType == "totp") {
            await page.router.changePage("TOTP_VIEW");
          } else if (page.state.secretMountType == "transit") {
            await page.router.changePage("TRANSIT_VIEW");
          }
        }}
      >
        {page.state.baseMount + " "}
      </a>
      {...page.state.secretPath.map((secretPath, index, secretPaths) => (
        <a
          onClick={async () => {
            page.state.secretVersion = null;
            if (page.state.secretMountType.startsWith("kv")) {
              page.state.secretPath = secretPaths.slice(0, index + 1);
              await page.router.changePage("KEY_VALUE_VIEW");
            }
          }}
        >
          {secretPath + " "}
        </a>
      ))}
      {page.state.secretItem.length != 0 && <span>{currentTitleSecretText(page)}</span>}
      {suffix.length != 0 && <span>{suffix}</span>}
    </div>
  );
}
