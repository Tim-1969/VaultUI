/* eslint-disable */
import { ElementInfo, makeElement } from "z-makeelement";
/* eslint-enable */

export function Form(
  children: Element[],
  submit: (form: HTMLFormElement) => unknown,
  options: Partial<ElementInfo> = {},
): HTMLFormElement {
  const form = makeElement({
    tag: "form",
    children: children,
    ...options,
  }) as HTMLFormElement;

  form.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    submit(form);
  });

  return form;
}
