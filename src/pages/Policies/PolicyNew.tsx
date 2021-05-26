import { Form } from "../../elements/Form";
import { Margin } from "../../elements/Margin";
import { Page } from "../../types/Page";
import { createOrUpdatePolicy } from "../../api/sys/policies/createOrUpdatePolicy";
import { getPolicies } from "../../api/sys/policies/getPolicies";
import { render } from "preact";
import { setErrorText } from "../../pageUtils";
import i18next from "i18next";

export class PolicyNewPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("POLICIES_HOME");
  }
  async render(): Promise<void> {
    render(
      <div>
        <Form
          onSubmit={async (formData) => {
            const name = formData.get("name") as string;
            if ((await getPolicies()).includes(name)) {
              setErrorText(i18next.t("policy_new_already_exists"));
              return;
            }

            try {
              await createOrUpdatePolicy(name, " ");
              this.state.policyItem = name;
              await this.router.changePage("POLICY_VIEW");
            } catch (e: unknown) {
              const error = e as Error;
              setErrorText(error.message);
            }
          }}
        >
          <Margin>
            <input
              class="uk-input uk-form-width-medium"
              name="name"
              placeholder={i18next.t("policy_new_name_placeholder")}
              required
            />
          </Margin>
          <p class="uk-text-danger" id="errorText" />
          <button class="uk-button uk-button-primary" type="submit">
            {i18next.t("policy_new_create_btn")}
          </button>
        </Form>
      </div>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("policy_new_title");
  }
}
