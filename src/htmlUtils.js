export function makeElement(elementInfo) {
  if ("condition" in elementInfo) { if (!elementInfo.condition) { return null; } }
  let element = document.createElement(elementInfo.tag);
  if ("class" in elementInfo) {
    if (Array.isArray(elementInfo.class)) {
      element.classList.add(...elementInfo.class);
    } else {
      element.classList.add(elementInfo.class);
    }
  }
  if ("id" in elementInfo) element.id = elementInfo.id;
  if ("html" in elementInfo) element.innerHTML = elementInfo.html;
  if ("onclick" in elementInfo) element.onclick = elementInfo.onclick;
  if ("attributes" in elementInfo) setElementAttributes(element, elementInfo.attributes);
  if ("text" in elementInfo) element.innerText = elementInfo.text;
  if ("children" in elementInfo) {
    if (Array.isArray(elementInfo.children)) {
      elementInfo.children.forEach(child => {
        if (child != null) element.appendChild(child);
      });
    } else {
      if (elementInfo.children != null) element.appendChild(elementInfo.children);
    }
  }
  if ("thenRun" in elementInfo) {
    elementInfo.thenRun(element);
  }

  return element;
}

export function setElementAttributes(element, attributes) {
  for (let key of Object.getOwnPropertyNames(attributes)) {
    element.setAttribute(key, attributes[key]);
  }
}