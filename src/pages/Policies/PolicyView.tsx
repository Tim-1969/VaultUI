import { CodeBlock } from "../../elements/CodeBlock";
import { Margin } from "../../elements/Margin";
import { Page } from "../../types/Page";
import { getPolicy } from "../../api/sys/policies/getPolicy";
import { notImplemented, prePageChecks } from "../../pageUtils";
import { render } from "preact";
import i18next from "i18next";

export class PolicyViewPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("POLICIES_HOME");
  }
  async render(): Promise<void> {
    await this.router.setPageContent("");
    if (!(await prePageChecks(this.router))) return;

    const policy = await getPolicy(this.state.policyItem);

    render(
      <div>
        <p>
          <button class="uk-button uk-button-primary" onClick={notImplemented}>
            {i18next.t("policy_view_edit_btn")}
          </button>
          {this.state.policyItem !== "default" && (
            <button
              class="uk-button uk-button-danger"
              onClick={async () => {
                await this.router.changePage("POLICY_DELETE");
              }}
            >
              {i18next.t("policy_view_delete_btn")}
            </button>
          )}
        </p>

        <Margin>
          <CodeBlock language="hcl" code={policy} />
        </Margin>
      </div>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("policy_view_title", {
      policy: this.state.policyItem,
    });
  }
}
