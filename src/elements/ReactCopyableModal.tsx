import { Component, JSX, createRef } from "preact";
import { addClipboardNotifications } from "../pageUtils";
import ClipboardJS from "clipboard";
import FileSaver from "file-saver";
import UIkit from "uikit";
import i18next from "i18next";

export type CopyableModalProps = {
  name: string;
  contentString: string;
};

export class CopyableModal extends Component<CopyableModalProps, unknown> {
  ref = createRef();
  copyButtonRef = createRef();

  saveAsFile(): void {
    const blob = new Blob([this.props.contentString], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, "result.txt");
  }

  componentDidMount(): void {
    const clipboard = new ClipboardJS(this.copyButtonRef.current);
    addClipboardNotifications(clipboard, 600);
    UIkit.modal(this.ref.current).show();
  }

  render(): JSX.Element {
    return (
      <div ref={this.ref} class="modal-section" uk-modal>
        <div class="uk-modal-dialog">
          <button class="uk-modal-close-default" type="button" uk-close />
          <div class="uk-modal-header">
            <h2>{this.props.name}</h2>
          </div>
          <div class="uk-modal-body">
            <pre class="wrap-pre">{this.props.contentString}</pre>
          </div>
          <div class="uk-modal-footer uk-text-right">
            <button
              class="uk-button uk-button-primary"
              type="button"
              onClick={() => this.saveAsFile()}
            >
              {i18next.t("copy_modal_download_btn")}
            </button>
            <button
              class="uk-button uk-button-primary"
              ref={this.copyButtonRef}
              type="button"
              data-clipboard-text={this.props.contentString}
            >
              {i18next.t("copy_modal_copy_btn")}
            </button>
            <button
              class="uk-button uk-button-secondary uk-modal-close"
              type="button"
              data-clipboard-text={this.props.contentString}
            >
              {i18next.t("copy_modal_close_btn")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
