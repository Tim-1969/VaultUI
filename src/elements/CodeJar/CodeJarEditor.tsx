import { Component, JSX, createRef } from "preact";
import { CodeJar as _CodeJar } from "codejar";

interface CodeJarProps {
  language: string;
  tabSize: number;
  code: string;
  onUpdate: (code: string) => void;
}

export class CodeJarEditor extends Component<CodeJarProps, unknown> {
  editorRef = createRef<HTMLDivElement>();
  jar = createRef<_CodeJar | null>();

  componentDidMount(): void {
    this.jar.current = _CodeJar(this.editorRef.current, () => {}, {
      tab: " ".repeat(this.props.tabSize),
      window: window,
    });

    this.jar.current.updateCode(this.props.code);

    this.jar.current.onUpdate((txt) => {
      this.props.onUpdate(txt);
    });
  }

  componentWillUnmount(): void {
    if (this.jar.current) {
      this.jar.current.destroy();
    }
  }

  componentDidUpdate(prevProps: CodeJarProps): void {
    if (!this.jar.current) return;

    if (
      prevProps.code !== this.props.code ||
      prevProps.tabSize !== this.props.tabSize ||
      prevProps.language !== this.props.language
    ) {
      this.componentDidMount();
    }
  }

  render(): JSX.Element {
    return <div class={"editor language-" + this.props.language} ref={this.editorRef} />;
  }
}
