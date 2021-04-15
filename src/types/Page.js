import {changePage} from  "../pageUtils.js";

export class Page {
  constructor() { }
  render() {
  }
  get name() {
    return "Page";
  }
  goBack() {
    changePage(pages.HOME);
  }
  cleanup() {
  }
}