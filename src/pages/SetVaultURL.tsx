import { Form } from "../elements/ReactForm";
import { Margin } from "../elements/ReactMargin";
import { Page } from "../types/Page";
import { render } from "preact";

export class SetVaultURLPage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    render(
      <Form onSubmit={(data) => this.onSubmit(data)}>
        <Margin>
          <input
            class="uk-input uk-form-width-medium"
            name="vaultURL"
            type="text"
            placeholder="Vault URL"
            required
          />
        </Margin>
        <p id="errorText" class="uk-text-danger" />
        <Margin>
          <button class="uk-button uk-button-primary" type="submit">
            Set
          </button>
        </Margin>
      </Form>,

      this.router.pageContentElement,
    );
  }

  async onSubmit(data: FormData): Promise<void> {
    this.state.apiURL = data.get("vaultURL") as string;
    await this.router.changePage("HOME");
  }

  get name(): string {
    return "Set Vault URL";
  }
}
