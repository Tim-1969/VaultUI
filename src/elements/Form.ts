import { makeElement } from "z-makeelement";

export function Form(
  children: Element[],
  submit: (form: HTMLFormElement) => unknown,
): HTMLFormElement {
  const form = makeElement({
    tag: "form",
    children: children,
  }) as HTMLFormElement;

  form.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    submit(form);
  });

  return form;
}
