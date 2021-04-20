import { changePage } from "../pageUtils.js";

export class Page {
  constructor() { }
  render() {
  }
  get name() {
    return "Page";
  }
  get titleSuffix() {
    return "";
  }
  goBack() {
    changePage("HOME");
  }
  cleanup() {
  }
}