import { Page } from "../types/Page.js";
import { setPageContent, setTitleElement } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";

export class TemplatePage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage("HOME");
  }
  async render() {
    setTitleElement(pageState);
    setPageContent(makeElement({
      tag: "p",
      text: "[PLACEHOLDER]"
    }));
  }

  get name() {
    return "Template";
  }
}
