import { makeElement } from "z-makeelement";
import { Margin } from "./Margin";

export function InputWithTitle(
  title: string,
  children: Element | Element[],
): Element {
  return Margin([
    makeElement({
      tag: "label",
      class: "uk-form-label",
      children: makeElement({
        tag: "span",
        text: title
      })
    }),
    makeElement({
      tag: "div",
      class: "uk-form-controls uk-form-controls-text uk-margin-small-top",
      children: children
    })
  ]);
}
