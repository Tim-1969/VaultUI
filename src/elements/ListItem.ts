import { makeElement } from "z-makeelement";

export function ListItem(children: Element[] | Element): HTMLElement {
  return makeElement({
    tag: "li",
    children: children,
  });
}
