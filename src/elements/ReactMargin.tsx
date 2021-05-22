
import { JSX } from "preact";

export type MarginProps = {
  children?: JSX.Element|JSX.Element[];
};

export function Margin(props: MarginProps): JSX.Element {
  return (
    <div class="uk-margin">
      {props.children}
    </div>
  )
}
