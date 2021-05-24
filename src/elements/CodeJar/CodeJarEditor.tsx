import { CodeJar } from "codejar";
import { JSX } from "preact";
import { Ref, useEffect, useRef } from "preact/compat";

interface EditorProps {
  highlight: unknown;
  options?: { tab: string };
  code: string;
  onUpdate: (code: string) => void;
}

export const useCodeJar = (props: EditorProps): Ref<HTMLDivElement> => {
  const editorRef = useRef<HTMLDivElement>(null);
  const jar = useRef<CodeJar | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    jar.current = CodeJar(
      editorRef.current,
      props.highlight as (e: HTMLElement, pos?: unknown) => void,
      { ...props.options, window: window },
    );

    jar.current.updateCode(props.code);

    jar.current.onUpdate((txt) => {
      if (!editorRef.current) return;
      props.onUpdate(txt);
    });

    return () => jar.current.destroy();
  }, []);

  useEffect(() => {
    if (!jar.current || !editorRef.current) return;
    jar.current.updateCode(props.code);
  }, [props.code]);

  useEffect(() => {
    if (!jar.current || !props.options) return;

    jar.current.updateOptions(props.options);
  }, [props.options]);

  return editorRef;
};

export function CodeJarEditor(props: EditorProps): JSX.Element {
  const editorRef = useCodeJar(props);

  return <div class="editor language-json" ref={editorRef}></div>;
}
