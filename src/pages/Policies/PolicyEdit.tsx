import { CodeEditor } from "../../elements/CodeEditor";
import { Component, JSX, render } from "preact";
import { Margin } from "../../elements/Margin";
import { MarginInline } from "../../elements/MarginInline";
import { Page } from "../../types/Page";
import { createOrUpdatePolicy } from "../../api/sys/policies/createOrUpdatePolicy";
import { getPolicy } from "../../api/sys/policies/getPolicy";
import { setErrorText } from "../../pageUtils";
import i18next from "i18next";

type PolicyEditorProps = {
  page: Page;
  policy_name: string;
};

type PolicyEditorState =
  | {
      dataLoaded: false;
    }
  | {
      dataLoaded: true;
      policyData: string;
      code: string;
    };

export class PolicyEditor extends Component<PolicyEditorProps, PolicyEditorState> {
  constructor() {
    super();
    this.state = {
      dataLoaded: false,
    };
  }

  async editorSave(): Promise<void> {
    if (!this.state.dataLoaded) return;

    try {
      await createOrUpdatePolicy(this.props.policy_name, this.state.code);
      await this.props.page.router.changePage("POLICY_VIEW");
    } catch (e: unknown) {
      const error = e as Error;
      setErrorText(error.message);
    }
  }

  onCodeUpdate(code: string): void {
    this.setState({
      code: code,
    });
  }

  async loadData(): Promise<void> {
    const policyData = await getPolicy(this.props.policy_name);
    this.setState({
      dataLoaded: true,
      policyData: policyData,
      code: policyData,
    });
    return;
  }

  componentDidMount(): void {
    if (!this.state.dataLoaded) {
      void this.loadData();
    }
  }

  render(): JSX.Element {
    if (!this.state.dataLoaded) {
      return <p>{i18next.t("content_loading")}</p>;
    }

    return (
      <div>
        <p class="uk-text-danger" id="errorText" />
        <Margin>
          <CodeEditor
            language="hcl"
            tabSize={2}
            code={this.state.policyData}
            onUpdate={(code) => this.onCodeUpdate(code)}
          />
        </Margin>
        <MarginInline>
          <button class="uk-button uk-button-primary" onClick={() => this.editorSave()}>
            {i18next.t("policy_edit_edit_btn")}
          </button>
        </MarginInline>
      </div>
    );
  }
}

export class PolicyEditPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("POLICY_VIEW");
  }
  async render(): Promise<void> {
    render(
      <div>
        <PolicyEditor page={this} policy_name={this.state.policyItem} />
      </div>,
      this.router.pageContentElement,
    );
  }

  get name(): string {
    return i18next.t("policy_edit_title", {
      policy: this.state.policyItem,
    });
  }
}
