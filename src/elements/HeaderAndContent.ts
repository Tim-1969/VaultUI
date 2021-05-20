import { makeElement } from "z-makeelement";

export function HeaderAndContent(title: string, content: string): HTMLElement {
  return makeElement({
    tag: "tr",
    children: [
      makeElement({
        tag: "td",
        children: makeElement({
          tag: "h5",
          text: title,
        }),
      }),
      makeElement({
        tag: "td",
        children: makeElement({
          tag: "p",
          text: content,
        }),
      }),
    ],
  });
}
