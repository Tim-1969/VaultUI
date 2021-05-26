import { Margin } from "../../elements/Margin";
import { Page } from "../../types/Page";
import { getPolicies } from "../../api/sys/getPolicies";
import { notImplemented, prePageChecks } from "../../pageUtils";
import { render } from "preact";
import i18next from "i18next";

export class PoliciesHomePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("HOME");
  }
  async render(): Promise<void> {
    await this.router.setPageContent("");
    if (!(await prePageChecks(this.router))) return;

    let policies = await getPolicies();
    policies = policies.sort();
    policies = policies.filter(function (policy_name) {
      return policy_name !== "root";
    });

    render(
      <div>
        <p>
          <button class="uk-button uk-button-primary" onClick={notImplemented}>
            {i18next.t("policies_home_new_btn")}
          </button>
        </p>

        <Margin>
          <ul class="uk-nav uk-nav-default">
            {policies.map((policy: string) => (
              <li>
                <a
                  onClick={async () => {
                    this.state.policyItem = policy;
                    await this.router.changePage("POLICY_VIEW");
                  }}
                >
                  {policy}
                </a>
              </li>
            ))}
          </ul>
        </Margin>
      </div>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("policies_home_title");
  }
}
