import { makeElement } from "../htmlUtils";

export function MarginInline(children: null | Element | (Element | null[])): Element {
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