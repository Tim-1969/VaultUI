import { JSX } from "preact";

export type MarginInlineProps = {
  children?: JSX.Element | JSX.Element[];
};

export function MarginInline(props: MarginInlineProps): JSX.Element {
  return (
    <div class="uk-margin">
      <div class="uk-inline">{props.children}</div>
    </div>
  );
}
