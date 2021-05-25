import { Component, JSX, createRef } from "preact";
import UIkit from "uikit";

export enum GridSizes {
  NORMAL = "uk-grid-small uk-text-left",
  MATCHING_TWO_ROWS = "uk-child-width-1-1@s uk-child-width-1-2@m uk-grid-small uk-grid-match",
}

export type GridProps = {
  children: JSX.Element | JSX.Element[];
  size: GridSizes;
};

type UIkitElement = {
  $destroy: () => void;
};

export class Grid extends Component<GridProps, unknown> {
  gridElement = createRef<HTMLDivElement>();

  componentWillUnmount(): void {
    try {
      (this.gridElement.current as unknown as UIkitElement).$destroy();
    } catch {
      // Do Nothing
    }
  }

  componentDidMount(): void {
    UIkit.grid(this.gridElement.current);
  }

  render(): JSX.Element {
    return (
      <div class={this.props.size} ref={this.gridElement}>
        {this.props.children}
      </div>
    );
  }
}
