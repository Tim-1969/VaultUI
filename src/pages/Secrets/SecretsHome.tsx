import { JSX, render } from "preact";
import { MountType, getMounts } from "../../api/sys/getMounts";
import { Page } from "../../types/Page";
import { getCapsPath } from "../../api/sys/getCapabilities";
import { prePageChecks } from "../../pageUtils";
import { sortedObjectMap } from "../../utils";
import i18next from "i18next";

export type MountLinkProps = {
  page: Page;
  mount: MountType;
  baseMount: string;
};

const supportedMountTypes = ["kv", "totp", "transit", "cubbyhole"];

export function isSupportedMount(mount: MountType): boolean {
  if (typeof mount != "object") return false;
  if (mount == null) return false;
  if (!("type" in mount)) return false;
  if (!supportedMountTypes.includes(mount.type)) return false;
  return true;
}

function MountLink(props: MountLinkProps): JSX.Element {
  const mount = props.mount;
  const baseMount = props.baseMount;
  const page = props.page;

  const secretMountType = mount.type == "kv" ? "kv-v" + String(mount.options.version) : mount.type;

  let linkText = "";
  let linkPage: string;
  if (mount.type == "kv") {
    linkText = `K/V (v${mount.options.version}) - ${baseMount}`;
    linkPage = "KEY_VALUE_VIEW";
  } else if (mount.type == "totp") {
    linkText = `TOTP - ${baseMount}`;
    linkPage = "TOTP_VIEW";
  } else if (mount.type == "transit") {
    linkText = `Transit - ${baseMount}`;
    linkPage = "TRANSIT_VIEW";
  } else if (mount.type == "cubbyhole") {
    linkText = `Cubbyhole - ${baseMount}`;
    linkPage = "KEY_VALUE_VIEW";
  }

  return (
    <li>
      <a
        onClick={async () => {
          page.state.baseMount = baseMount;
          page.state.secretMountType = secretMountType;
          await page.router.changePage(linkPage);
        }}
      >
        {linkText}
      </a>
    </li>
  );
}

export class SecretsHomePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("HOME");
  }
  async render(): Promise<void> {
    if (!(await prePageChecks(this.router))) return;

    this.state.baseMount = "";
    this.state.secretPath = [];
    this.state.secretItem = "";
    this.state.secretVersion = null;

    const mountsCapabilities = await getCapsPath("/sys/mounts");
    const mounts = await getMounts();
    // sort it by secretPath so it's in alphabetical order consistantly.
    const mountsMap = sortedObjectMap(mounts);

    render(
      <div>
        <div>
          <p>
            {mountsCapabilities.includes("sudo") && mountsCapabilities.includes("create") && (
              <button
                class="uk-button uk-button-primary"
                onClick={async () => {
                  await this.router.changePage("NEW_SECRETS_ENGINE");
                }}
              >
                {i18next.t("secrets_home_new_secrets_engine_button")}
              </button>
            )}
          </p>
        </div>
        <div class="uk-margin-top">
          <ul class="uk-nav uk-nav-default">
            {Array.from(mountsMap as Map<string, MountType>).map((args: [string, MountType]) => {
              const baseMount = args[0];
              const mount = args[1];
              if (isSupportedMount(mount)) {
                return <MountLink page={this} mount={mount} baseMount={baseMount} />;
              }
            })}
          </ul>
        </div>
      </div>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("secrets_home_page_title");
  }
}
