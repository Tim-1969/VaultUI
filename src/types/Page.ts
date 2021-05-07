import { changePage } from "../pageUtils";

export class Page {
  constructor() {
    // Do Nothing
  }
  render(): any {
    // Do Nothing
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