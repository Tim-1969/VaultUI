import { changePage } from "../pageUtils";

export class Page {
  constructor() {
    // Do Nothing
  }
  render() {
    // Do Nothing
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
    // Do Nothing
  }
}