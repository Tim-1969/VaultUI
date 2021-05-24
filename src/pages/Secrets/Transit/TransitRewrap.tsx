import { CopyableModal } from "../../../elements/ReactCopyableModal";
import { Form } from "../../../elements/ReactForm";
import { Margin } from "../../../elements/ReactMargin";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { getTransitKey } from "../../../api/transit/getTransitKey";
import { objectToMap } from "../../../utils";
import { render } from "preact";
import { setErrorText } from "../../../pageUtils";
import { transitRewrap } from "../../../api/transit/transitRewrap";
import UIkit from "uikit";
import i18next from "i18next";

type versionOption = { version: string; label: string };

export class TransitRewrapPage extends Page {
  constructor() {
    super();
  }

  async goBack(): Promise<void> {
    await this.router.changePage("TRANSIT_VIEW_SECRET");
  }

  async render(): Promise<void> {
    const transitKey = await getTransitKey(this.state.baseMount, this.state.secretItem);

    const stringVersions = Array.from(
      objectToMap(transitKey.keys).keys(),
    ).reverse() as unknown as string[];
    const versions = stringVersions.map((val): number => parseInt(val, 10));

    // get the selectable version options in the same
    // format the official UI uses.
    // e.g: ["2 (latest)", "1"]

    const options: versionOption[] = versions.map((val): versionOption => {
      const i18nkey =
        val == Math.max(...versions)
          ? "transit_rewrap_latest_version_option_text"
          : "transit_rewrap_version_option_text";
      return {
        version: String(val),
        label: i18next.t(i18nkey, { version_num: String(val) }),
      };
    });

    render(
      <Form onSubmit={async (data) => await this.onSubmit(data)}>
        <Margin>
          <select class="uk-select uk-width-1-2" name="version">
            {options.map((option) => (
              <option label={option.label} value={option.version}>
                {option.label}
              </option>
            ))}
          </select>
        </Margin>
        <Margin>
          <textarea
            class="uk-textarea uk-width-1-2"
            name="ciphertext"
            placeholder={i18next.t("transit_rewrap_input_placeholder")}
          />
        </Margin>
        <p class="uk-text-danger" id="errorText" />
        <button class="uk-button uk-button-primary" type="submit">
          {i18next.t("transit_rewrap_rewrap_btn")}
        </button>
        <div id="modalAttachmentPoint" />
      </Form>,
      this.router.pageContentElement,
    );
  }

  async onSubmit(data: FormData): Promise<void> {
    try {
      const res = await transitRewrap(this.state.baseMount, this.state.secretItem, {
        ciphertext: data.get("ciphertext") as string,
        key_version: parseInt(data.get("version") as string, 10),
      });
      render(
        <CopyableModal
          id="transitResultModal"
          name={i18next.t("transit_rewrap_result_modal_title")}
          contentString={res.ciphertext}
        />,
        document.querySelector("#modalAttachmentPoint"),
      );
      UIkit.modal(document.querySelector("#transitResultModal")).show();
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(`API Error: ${error.message}`);
    }
  }

  async renderPageTitle(): Promise<void> {
    render(
      <SecretTitleElement router={this.router} suffix={i18next.t("transit_rewrap_suffix")} />,
      this.router.pageTitleElement,
    );
  }

  get name(): string {
    return i18next.t("transit_rewrap_title");
  }
}
