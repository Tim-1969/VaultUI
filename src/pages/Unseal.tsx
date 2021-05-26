import { Component, JSX, render } from "preact";
import { Form } from "../elements/Form";
import { MarginInline } from "../elements/MarginInline";
import { Page } from "../types/Page";
import { QRScanner } from "../elements/QRScanner";
import { getSealStatus } from "../api/sys/getSealStatus";

import { setErrorText } from "../pageUtils";
import { submitUnsealKey } from "../api/sys/submitUnsealKey";
import { toStr } from "../utils";
import i18next from "i18next";

const UnsealInputModes = {
  FORM_INPUT: "FORM_INPUT",
  QR_INPUT: "QR_INPUT",
};

export type UnsealFormInputProps = {
  onSubmit: (code: string) => void;
};

export function UnsealFormInput(props: UnsealFormInputProps): JSX.Element {
  return (
    <Form
      onSubmit={(data: FormData) => {
        props.onSubmit(data.get("unsealKey") as string);
      }}
    >
      <MarginInline>
        <input
          class="uk-input uk-form-width-medium"
          name="unsealKey"
          type="password"
          placeholder={i18next.t("unseal_key_input_placeholder")}
          required
        />
      </MarginInline>
      <MarginInline>
        <button class="uk-button uk-button-primary" type="submit">
          {i18next.t("unseal_submit_key_btn")}
        </button>
      </MarginInline>
    </Form>
  );
}

type UnsealPageState = {
  mode: string;
  keys_submitted: number;
  keys_needed: number;
};

export class UnsealPageElement extends Component<{ page: Page }, UnsealPageState> {
  constructor() {
    super();
    this.state = {
      mode: UnsealInputModes.FORM_INPUT,
      keys_submitted: 0,
      keys_needed: 0,
    };
  }

  timer: number;

  async submitKey(key: string): Promise<void> {
    try {
      await submitUnsealKey(key);
      this.updateStateWithSealStatus();
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(error.message);
    }
  }

  updateStateWithSealStatus(): void {
    void getSealStatus().then((data) => {
      this.setState({
        keys_submitted: data.progress,
        keys_needed: data.t,
      });
      if (!data.sealed) {
        void this.props.page.router.changePage("HOME");
      }
    });
  }

  componentWillUnmount(): void {
    clearInterval(this.timer);
  }

  componentDidMount(): void {
    this.updateStateWithSealStatus();
    this.timer = setInterval(() => {
      this.updateStateWithSealStatus();
    }, 500) as unknown as number;
  }

  render(): JSX.Element {
    return (
      <div>
        <progress
          class="uk-progress"
          value={this.state.keys_submitted}
          max={this.state.keys_needed}
        />

        <p id="errorText" class="uk-text-danger uk-margin-top" />

        <p>
          {i18next.t("unseal_keys_progress", {
            progress: toStr(this.state.keys_submitted),
            keys_needed: toStr(this.state.keys_needed),
          })}
        </p>

        {this.state.mode == UnsealInputModes.FORM_INPUT && (
          <UnsealFormInput onSubmit={(code) => this.submitKey(code)} />
        )}

        {this.state.mode == UnsealInputModes.QR_INPUT && (
          <QRScanner onScan={(code) => this.submitKey(code)} />
        )}

        <button
          class="uk-button uk-button-primary"
          onClick={async () => {
            let newMethod: string;
            if (this.state.mode == UnsealInputModes.FORM_INPUT) {
              newMethod = UnsealInputModes.QR_INPUT;
            } else {
              newMethod = UnsealInputModes.FORM_INPUT;
            }
            this.setState({ mode: newMethod });
          }}
        >
          {this.state.mode == UnsealInputModes.QR_INPUT
            ? i18next.t("unseal_input_btn")
            : i18next.t("unseal_qr_btn")}
        </button>
      </div>
    );
  }
}

export class UnsealPage extends Page {
  constructor() {
    super();
  }

  async render(): Promise<void> {
    render(<UnsealPageElement page={this} />, this.router.pageContentElement);
  }

  get name(): string {
    return i18next.t("unseal_vault_text");
  }
}
