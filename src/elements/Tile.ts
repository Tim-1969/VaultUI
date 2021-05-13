import { makeElement } from "../htmlUtils";

type TileParams = {
  condition?: boolean;
  title: string;
  description: string;
  icon?: string;
  iconText?: string;
  onclick: () => void;
};

export function Tile(params: TileParams): HTMLElement {
  if (params.condition == false) return;
  return makeElement({
    tag: "a",
    class: "uk-link-heading",
    onclick: params.onclick,
    children: makeElement({
      tag: "div",
      class: ["uk-padding-small", "uk-background-primary"],
      children: [
        makeElement({
          tag: "p",
          class: "uk-h4",
          text: params.title,
          children: makeElement({
            condition: typeof params.icon == "string",
            tag: "span",
            class: ["uk-icon", "uk-margin-small-left"],
            attributes: {
              "uk-icon": `icon: ${params.icon}`,
              role: "img",
              "aria-label": params.iconText,
            },
          }),
        }),
        makeElement({
          tag: "span",
          class: "uk-text-muted",
          text: params.description,
        }),
      ],
    }),
  });
}
