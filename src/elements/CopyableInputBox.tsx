import { Component, JSX, createRef } from "preact";
import { MarginInline } from "./MarginInline";
import { addClipboardNotifications } from "../pageUtils";
import ClipboardJS from "clipboard";
import i18next from "i18next";

export type CopyableInputBoxProps = {
  text: string;
  copyable?: boolean;
};

export class CopyableInputBox extends Component<CopyableInputBoxProps, unknown> {
  copyIconRef = createRef();
  inputBoxRef = createRef();

  componentDidMount(): void {
    const clipboard = new ClipboardJS(this.copyIconRef.current);
    addClipboardNotifications(clipboard, 600);
  }

  render(): JSX.Element {
    return (
      <div>
        <MarginInline>
          {this.props.copyable && (
            <a
              ref={this.copyIconRef}
              class="uk-form-icon"
              uk-icon="icon: copy"
              role="img"
              data-clipboard-text={this.props.text}
              aria-label={i18next.t("copy_input_box_copy_icon_text")}
            />
          )}
          <input
            ref={this.inputBoxRef}
            class="uk-input uk-input-copyable"
            type="text"
            value={this.props.text}
            readonly
          />
        </MarginInline>
      </div>
    );
  }
}
