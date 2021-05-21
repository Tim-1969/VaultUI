import { makeElement, ElementInfo } from "z-makeelement";

export function Form(
  children: Element[],
  submit: (form: HTMLFormElement) => unknown,
  options: Partial<ElementInfo> = {}
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
