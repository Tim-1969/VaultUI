import { changePage } from "../pageUtils";

export class Page {
  constructor() {
    // Do Nothing
  }
  render(): unknown {
    // Do Nothing
    return null;
  }
  get name(): string {
    return "Page";
  }
  get titleSuffix(): string {
    return "";
  }
  goBack(): void {
    changePage("HOME");
  }
  cleanup(): void {
    // Do Nothing
  }
}