import * as React from 'react';
import "./index.less"

export interface IProps  {
  title: string

}

export default class Title extends React.Component<IProps> {

  public render() {
    const {title} = this.props

    return (
      <div className="component-parent-container"><h2> <span className="component-title-radius"></span>&nbsp; {title}</h2></div>
    )
  }
}

export class MiNiTitle extends React.Component<IProps> {

  public render() {
    const {title} = this.props

    return (
      <div className="component-parent-container-mini"><span className="component-title-radius-mini"></span>&nbsp; {title}</div>
    )
  }
}
