import { Component, JSX } from "preact";

export type TileParams = {
  disabled?: boolean;
  color?: string;
  title: string;
  description: string;
  icon?: string;
  iconText?: string;
  onclick: () => void;
};

export class Tile extends Component<TileParams, unknown> {
  render(): JSX.Element {
    const defaultColor = this.props.disabled == true ? "secondary" : "primary";

    const tileInner = (
      <div class={"uk-padding-small uk-background-" + (this.props.color || defaultColor)}>
        <p class="uk-h4">
          {this.props.title}
          {typeof this.props.icon == "string" && (
            <span
              class="uk-icon uk-margin-small-left"
              uk-icon={`icon: ${this.props.icon}`}
              role="img"
              aria-label={this.props.iconText}
            ></span>
          )}
        </p>
        <span class="uk-text-muted">{this.props.description}</span>
      </div>
    );

    if (this.props.disabled == true) {
      return <p>{tileInner}</p>;
    } else {
      return (
        <a class="uk-link-heading" onClick={this.props.onclick}>
          {tileInner}
        </a>
      );
    }
  }
}
