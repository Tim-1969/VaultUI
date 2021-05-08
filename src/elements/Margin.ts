import { makeElement } from "../htmlUtils";

export function Margin(children: Element | Element[]): Element {
  return makeElement({
    tag: "div",
    class: "uk-margin",
    children: children
  });
}