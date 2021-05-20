import { Form } from "../elements/Form";
import { Page } from "../types/Page";
import { makeElement } from "z-makeelement";

export class SetVaultURLPage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    await this.router.setPageContent(
      Form(
        [
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
        async (form: HTMLFormElement) => {
          const formData = new FormData(form);
          this.state.apiURL = formData.get("vaultURL") as string;
          await this.router.changePage("HOME");
        },
      ),
    );
  }
  get name(): string {
    return "Set Vault URL";
  }
}
