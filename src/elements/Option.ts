import { makeElement } from "../htmlUtils";

export function Option(label: string, value: string): HTMLElement {
  return makeElement({
    tag: "option",
    text: label,
    attributes: {
      label: label,
      value: value,
    }
  })
}