import {getObjectKeys} from "./utils.js";

const optionsFunctions = {
  class: (e, arg) => {
    if (Array.isArray(arg)) {
      e.classList.add(...arg);
    } else {
      e.classList.add(arg);
    }
  },
  id: (e, arg) => e.id = arg,
  html: (e, arg) => e.innerHTML = arg,
  onclick: (e, arg) => e.onclick = arg,
  attributes: setElementAttributes,
  text: (e, arg) => e.innerText = arg,
  children: (e, arg) => {
    if (Array.isArray(arg)) {
      arg.forEach(child => {
        if (child != null) e.appendChild(child);
      });
    } else {
      if (arg != null) e.appendChild(arg);
    }
  },
  thenRun: (e, arg) => arg(e),
}

export function makeElement(elementInfo) {
  if ("condition" in elementInfo) { if (!elementInfo.condition) { return null; } }
  let element = document.createElement(elementInfo.tag);

  for (let key of Object.getOwnPropertyNames(elementInfo)) {
    if (getObjectKeys(optionsFunctions).includes(key)) {
      optionsFunctions[key](element, elementInfo[key]);
    }
  }

  return element;
}

export function setElementAttributes(element, attributes) {
  for (let key of Object.getOwnPropertyNames(attributes)) {
    element.setAttribute(key, attributes[key]);
  }
}