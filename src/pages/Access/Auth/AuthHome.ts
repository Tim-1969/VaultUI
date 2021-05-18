import { Page } from "../../../types/Page";
import i18next from "i18next";
import { setErrorText } from "../../../pageUtils";

export class AuthHomePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("ACCESS_HOME");
  }
  async render(): Promise<void> {
    setErrorText(i18next.t("not_implemented"));
  }
  get name(): string {
    return i18next.t("auth_home_title");
  }
}
