import { makeElement } from "../htmlUtils.js";

export function MarginInline(children, marginOptions = {}, inlineOptions = {}) {
  return makeElement({
    tag: "div",
    class: "uk-margin",
    children: makeElement({
      tag: "div",
      class: "uk-inline",
      children: children,
      ...inlineOptions,
    }),
    ...marginOptions,
  });
}