import { CodeEditor } from "../../../elements/CodeEditor";
import { Component, JSX, render } from "preact";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { createOrUpdateSecret } from "../../../api/kv/createOrUpdateSecret";
import { getSecret } from "../../../api/kv/getSecret";
import { setErrorText } from "../../../pageUtils";
import { sortedObjectMap, verifyJSONString } from "../../../utils";
import i18next from "i18next";
//import { highlightElement } from "prismjs";

export type KVEditProps = {
  page: Page;
};

type KVEditState =
  | {
      dataLoaded: false;
    }
  | {
      dataLoaded: true;
      kvData: Record<string, unknown>;
      code: string;
    };

export class KVEditor extends Component<KVEditProps, KVEditState> {
  constructor() {
    super();
    this.state = {
      dataLoaded: false,
    };
  }

  async editorSave(): Promise<void> {
    if (!this.state.dataLoaded) return;
    const editorContent = this.state.code;

    if (!verifyJSONString(editorContent)) {
      setErrorText(i18next.t("kv_sec_edit_invalid_json_err"));
      return;
    }

    await createOrUpdateSecret(
      this.props.page.state.baseMount,
      this.props.page.state.secretMountType,
      this.props.page.state.secretPath,
      this.props.page.state.secretItem,
      JSON.parse(editorContent),
    );
    await this.props.page.router.changePage("KEY_VALUE_SECRET");
  }

  onCodeUpdate(code: string): void {
    this.setState({
      code: code,
    });
  }

  loadData(): void {
    void getSecret(
      this.props.page.state.baseMount,
      this.props.page.state.secretMountType,
      this.props.page.state.secretPath,
      this.props.page.state.secretItem,
    ).then((kvData) => {
      this.setState({
        dataLoaded: true,
        kvData: kvData,
        code: this.getStringKVData(kvData),
      });
    });
    return;
  }

  componentDidMount(): void {
    if (!this.state.dataLoaded) {
      this.loadData();
    }
  }

  getStringKVData(data: Record<string, unknown>): string {
    return JSON.stringify(Object.fromEntries(sortedObjectMap(data)), null, 4);
  }

  render(): JSX.Element {
    if (!this.state.dataLoaded) {
      return <p>{i18next.t("content_loading")}</p>;
    }

    return (
      <div>
        <p class="uk-text-danger" id="errorText" />
        <CodeEditor
          language="json"
          tabSize={4}
          code={this.getStringKVData(this.state.kvData)}
          onUpdate={(code) => this.onCodeUpdate(code)}
        />
        <button class="uk-button uk-button-primary" onClick={() => this.editorSave()}>
          {i18next.t("kv_sec_edit_btn")}
        </button>
      </div>
    );
  }
}

export class KeyValueSecretEditPage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("KEY_VALUE_SECRET");
  }
  async render(): Promise<void> {
    render(<KVEditor page={this} />, this.router.pageContentElement);
  }

  async renderPageTitle(): Promise<void> {
    render(
      <SecretTitleElement router={this.router} suffix={i18next.t("kv_sec_edit_suffix")} />,
      this.router.pageTitleElement,
    );
  }

  get name(): string {
    return i18next.t("kv_sec_edit_title");
  }
}
