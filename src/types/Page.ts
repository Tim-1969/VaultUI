import { changePage } from "../pageUtils";

export class Page {
  constructor() {
    // Do Nothing
  }
  async render(): Promise<void> {}
  get name(): string {
    return "Page";
  }
  get titleSuffix(): string {
    return "";
  }
  async goBack(): Promise<void> {
    await changePage("HOME");
  }
  async cleanup(): Promise<void> {
    // Do Nothing
  }
}
