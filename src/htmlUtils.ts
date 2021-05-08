import { getObjectKeys } from "./utils";

type optionsFunctionsObject = {
  [key: string]: (e: any, arg: any) => void
}

const optionsFunctions: optionsFunctionsObject = {
  "class": (e: Element, arg: string | string[]) => {
    if (Array.isArray(arg)) {
      e.classList.add(...arg);
    } else {
      e.classList.add(arg);
    }
  },
  "id": (e: Element, arg: string) => e.id = arg,
  "html": (e: Element, arg: string) => e.innerHTML = arg,
  "onclick": (e: HTMLButtonElement, arg: any) => e.onclick = arg,
  "attributes": setElementAttributes,
  "text": (e: HTMLParagraphElement, arg: string) => e.innerText = arg,
  "children": (e: Element, arg: Element | Element[]) => {
    if (Array.isArray(arg)) {
      arg.forEach(child => {
        if (child != null) e.appendChild(child);
      });
    } else {
      if (arg != null) e.appendChild(arg);
    }
  },
  "thenRun": (e: Element, arg: (e: Element) => void) => arg(e),
}

interface ElementInfo {
  condition?: boolean;
  tag: string;
  class?: string | string[];
  id?: string;
  html?: string;
  attributes?: {
    [propName: string]: any
  };
  children?: Element | Element[];
  text?: string;
  thenRun?: (e: Element) => void;
  [propName: string]: any;
}

export function makeElement(elementInfo: ElementInfo): HTMLElement {
  if ("condition" in elementInfo) { if (!elementInfo.condition) { return null; } }
  const element = document.createElement(elementInfo.tag);

  for (const key of Object.getOwnPropertyNames(elementInfo)) {
    if (getObjectKeys(optionsFunctions).includes(key)) {
      (optionsFunctions as any)[key](element, elementInfo[key]);
    }
  }

  return element;
}

export function setElementAttributes(element: Element, attributes: {[propName: string]: any}): void {
  for (const key of Object.getOwnPropertyNames(attributes)) {
    element.setAttribute(key, attributes[key]);
  }
}