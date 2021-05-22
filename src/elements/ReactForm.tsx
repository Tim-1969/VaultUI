import { Component, JSX, createRef } from "preact";

export type FormProps = {
  onSubmit: (form: FormData) => unknown;
  children?: JSX.Element | JSX.Element[];
};

export class Form extends Component<FormProps, unknown> {
  ref = createRef();

  render(): JSX.Element {
    return (
      <form
        onSubmit={(e: Event) => {
          e.preventDefault();
          console.log(this.ref.current);
          this.props.onSubmit(new FormData(this.ref.current));
        }}
        ref={this.ref}
      >
        {this.props.children}
      </form>
    );
  }
}
