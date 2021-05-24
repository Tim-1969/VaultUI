import { JSX } from "preact";
import { Margin } from "./Margin";

export type InputWithTitleProps = {
  title: string;
  children?: JSX.Element | JSX.Element[];
};

export function InputWithTitle(props: InputWithTitleProps): JSX.Element {
  return (
    <Margin>
      <label class="uk-form-label">
        <span>{props.title}</span>
      </label>
      <div class="uk-form-controls uk-form-controls-text uk-margin-small-top">{props.children}</div>
    </Margin>
  );
}
