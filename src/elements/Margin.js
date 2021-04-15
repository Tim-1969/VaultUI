import { makeElement } from "../htmlUtils.js";

export function Margin(children) {
  return makeElement({
    tag: "div",
    class: "uk-margin",
    children: children
  });
}