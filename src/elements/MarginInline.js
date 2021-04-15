import { makeElement } from "../htmlUtils.js";

export function MarginInline(children) {
  return makeElement({
    tag: "div",
    class: "uk-margin",
    children: makeElement({
      tag: "div",
      class: "uk-inline",
      children: children
    })
  });
}