import { makeElement } from "../htmlUtils";

export function ListItem(children: Element[] | Element): HTMLElement {
  return makeElement({
    tag: "li",
    children: children,
  });
}
