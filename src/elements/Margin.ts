import { makeElement } from "../htmlUtils";

export function Margin(children: null | Element | (Element | null[])): Element {
  return makeElement({
    tag: "div",
    class: "uk-margin",
    children: children
  });
}