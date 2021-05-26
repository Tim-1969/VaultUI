import { JSX } from "preact";
import Prism from "prismjs";

export type CodeBlockProps = {
  language: string;
  code: string;
};

export function CodeBlock(props: CodeBlockProps): JSX.Element {
  const highlightedCode = Prism.highlight(
    props.code,
    Prism.languages[props.language],
    props.language,
  );

  return (
    <pre
      class="code-block language-json line-numbers"
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}
