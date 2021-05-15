import { Page } from "../PageSystem/Page";
import { makeElement } from "../htmlUtils";

export class SetVaultURLPage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    await this.router.setPageContent(
      makeElement({
        tag: "form",
        id: "setVaultURLForm",
        children: [
          makeElement({
            tag: "div",
            class: "uk-margin",
            children: makeElement({
              tag: "input",
              class: ["uk-input", "uk-form-width-medium"],
              attributes: {
                required: "true",
                type: "text",
                placeholder: "Vault URL",
                name: "vaultURL",
              },
            }),
          }),
          makeElement({
            tag: "p",
            id: "errorText",
            class: "uk-text-danger",
          }),
          makeElement({
            tag: "button",
            class: ["uk-button", "uk-button-primary"],
            text: "Set",
            attributes: {
              type: "submit",
            },
          }),
        ],
      }),
    );
    document.getElementById("setVaultURLForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(document.querySelector("#setVaultURLForm"));
      this.state.apiURL = formData.get("vaultURL") as string;
      await this.router.changePage("HOME");
    });
  }
  get name(): string {
    return "Set Vault URL";
  }
}
