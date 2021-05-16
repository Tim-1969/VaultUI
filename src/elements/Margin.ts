import { makeElement } from "z-makeelement";

export function Margin(children: Element | Element[]): Element {
  return makeElement({
    tag: "div",
    class: "uk-margin",
    children: children,
  });
}
