import { makeElement } from "z-makeelement";

export function MarginInline(children: Element | Element[]): Element {
  return makeElement({
    tag: "div",
    class: "uk-margin",
    children: makeElement({
      tag: "div",
      class: "uk-inline",
      children: children,
    }),
  });
}
