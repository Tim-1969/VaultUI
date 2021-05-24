import { Component, JSX, createRef, render } from "preact";
import { CopyableInputBox } from "../elements/ReactCopyableInputBox";
import { Form } from "../elements/ReactForm";
import { Margin } from "../elements/ReactMargin";
import { Page } from "../types/Page";
import i18next from "i18next";

const passwordLengthMin = 1;
const passwordLengthMax = 64;
const passwordLengthDefault = 24;

function random() {
  if (
    typeof window.crypto?.getRandomValues === "function" &&
    typeof window.Uint32Array === "function"
  ) {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
  }

  return Math.random();
}

const lowerCase = "abcdefghijklmnopqrstuvwxyz";
const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "1234567890";
const special = "!#$%&()*+,-./:;<=>?@[]^_{|}~";

const alphabets = {
  SECURE: lowerCase + upperCase + numbers + special,
  SMOL: lowerCase + numbers,
  HEX: "123456789ABCDEF",
};

const passwordOptionsDefault = {
  length: passwordLengthDefault,
  alphabet: alphabets.SECURE,
};

function genPassword(options = passwordOptionsDefault) {
  let pw = "";
  options = { ...passwordOptionsDefault, ...options };
  const pwArray = options.alphabet.split("");
  for (let i = 0; i < options.length; i++) {
    pw = pw.concat(pwArray[Math.floor(random() * pwArray.length)]);
  }
  return pw;
}

type PasswordGeneratorState = {
  length: number;
  alphabet: string;
};

export class PasswordGenerator extends Component<unknown, PasswordGeneratorState> {
  constructor() {
    super();
    this.state = {
      length: passwordOptionsDefault.length,
      alphabet: passwordOptionsDefault.alphabet,
    };
  }
  passwordLengthSlider = createRef<HTMLInputElement>();
  alphabetSelector = createRef<HTMLSelectElement>();

  getPasswordLengthText(length: number): string {
    return i18next.t("password_length_title", {
      min: length,
      max: passwordLengthMax,
    });
  }

  updateAlphabet(): void {
    this.setState({
      alphabet: this.alphabetSelector.current.value,
    });
  }

  updateLength(): void {
    this.setState({
      length: parseInt(this.passwordLengthSlider.current.value, 10),
    });
  }

  onSubmit(): void {
    this.updateLength();
    this.updateAlphabet();
  }

  // createRef
  render(): JSX.Element {
    return (
      <Form onSubmit={() => this.onSubmit()}>
        <Margin>
          <h4>{this.getPasswordLengthText(this.state.length)}</h4>
        </Margin>
        <Margin>
          <input
            class="uk-range uk-width-1-2"
            name="length"
            type="range"
            value={this.state.length}
            max={passwordLengthMax.toString()}
            min={passwordLengthMin.toString()}
            ref={this.passwordLengthSlider}
            onInput={() => {
              this.updateLength();
            }}
          />
        </Margin>
        <Margin>
          <select
            class="uk-select uk-width-1-2"
            ref={this.alphabetSelector}
            onInput={() => {
              this.updateAlphabet();
            }}
          >
            <option value={alphabets.SECURE}>a-z a-Z 0-9 specials</option>
            <option value={alphabets.SMOL}>a-z 0-9</option>
            <option value={alphabets.HEX}>A-F 1-9</option>
          </select>
        </Margin>

        <CopyableInputBox
          text={genPassword({
            length: this.state.length,
            alphabet: this.state.alphabet,
          })}
          copyable
        />
        <Margin>
          <button class="uk-button uk-button-primary uk-margin-bottom" type="submit">
            {i18next.t("gen_password_btn")}
          </button>
        </Margin>
      </Form>
    );
  }
}

export class PwGenPage extends Page {
  constructor() {
    super();
  }

  async render(): Promise<void> {
    render(<PasswordGenerator />, this.router.pageContentElement);
  }

  get name(): string {
    return i18next.t("password_generator_title");
  }
}
