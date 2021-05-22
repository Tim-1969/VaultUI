import { Component, JSX } from "preact";

export type TileParams = {
  condition?: boolean;
  color?: string;
  title: string;
  description: string;
  icon?: string;
  iconText?: string;
  onclick: () => void;
};

export class Tile extends Component<TileParams, unknown> {
  render(): JSX.Element {
    if (this.props.condition == false) return <></>;

    return (
      <a class="uk-link-heading" onClick={this.props.onclick}>
        <div class={"uk-padding-small uk-background-" + (this.props.color || "primary")}>
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
      </a>
    );
  }
}
