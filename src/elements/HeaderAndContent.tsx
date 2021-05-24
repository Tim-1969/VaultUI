import { JSX } from "preact";

export type HeaderAndContentProps = {
  title: string;
  content: string;
};

export function HeaderAndContent(props: HeaderAndContentProps): JSX.Element {
  return (
    <tr>
      <td>
        <h5>{props.title}</h5>
      </td>
      <td>
        <p>{props.content}</p>
      </td>
    </tr>
  );
}
