import { makeElement } from "../htmlUtils";

export function Margin(children, options = {}) {
  return makeElement({
    tag: "div",
    class: "uk-margin",
    children: children,
    ...options
  });
}