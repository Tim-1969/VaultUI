import { Page } from "../../types/Page";
import { deletePolicy } from "../../api/sys/policies/deletePolicy";
import { render } from "preact";
import { setErrorText } from "../../pageUtils";
import i18next from "i18next";

export class PolicyDeletePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("POLICY_VIEW");
  }
  async render(): Promise<void> {
    render(
      <div>
        <h5>{i18next.t("policy_delete_text")}</h5>
        <button
          class="uk-button uk-button-danger"
          onClick={async () => {
            try {
              await deletePolicy(this.state.policyItem);
              await this.router.changePage("POLICIES_HOME");
            } catch (e: unknown) {
              const error = e as Error;
              setErrorText(error.message);
            }
          }}
        >
          {i18next.t("policy_delete_btn")}
        </button>
      </div>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("policy_delete_title", {
      policy: this.state.policyItem,
    });
  }
}
