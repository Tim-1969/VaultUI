import { getObjectKeys } from "./utils";

type optionsFunctionsObject = {
  [key: string]: (e: Element, arg: unknown) => void;
};

const optionsFunctions: optionsFunctionsObject = {
  class: (e: Element, arg: string | string[]) => {
    if (!Array.isArray(arg)) {
      arg = String(arg).split(" ");
    }
    e.classList.add(...arg);
  },
  id: (e: Element, arg: string) => (e.id = arg),
  html: (e: Element, arg: string) => (e.innerHTML = arg),
  onclick: (e: Element, arg: () => void) => ((e as HTMLButtonElement).onclick = arg),
  attributes: setElementAttributes,
  text: (e: Element, arg: string) => ((e as HTMLParagraphElement).innerText = arg),
  children: (e: Element, arg: Element | Element[]) => {
    if (Array.isArray(arg)) {
      arg.forEach((child) => {
        if (child != null) e.appendChild(child);
      });
    } else {
      if (arg != null) e.appendChild(arg);
    }
  },
  thenRun: (e: Element, arg: (e: Element) => void) => arg(e),
};

interface ElementInfo {
  condition?: boolean;
  tag: string;
  class?: string | string[];
  id?: string;
  html?: string;
  attributes?: Record<string, string>;
  children?: Element | Element[];
  text?: string;
  thenRun?: (e: Element) => void;
  onclick?: () => void;
  [propName: string]: unknown;
}

export function makeElement(elementInfo: ElementInfo): HTMLElement {
  if ("condition" in elementInfo) {
    if (!elementInfo.condition) {
      return null;
    }
  }
  const element = document.createElement(elementInfo.tag);

  for (const key of Object.getOwnPropertyNames(elementInfo)) {
    if (getObjectKeys(optionsFunctions).includes(key)) {
      optionsFunctions[key](element, elementInfo[key]);
    }
  }

  return element;
}

export function setElementAttributes(element: Element, attributes: Record<string, string>): void {
  for (const key of Object.getOwnPropertyNames(attributes)) {
    element.setAttribute(key, attributes[key]);
  }
}

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
