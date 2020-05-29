import React from "react";
import "./css/Utility.css";

export class Utility extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
    };
  }

  render() {
    return (
      <div className="container Utility">
        <h4>{this.state.title}</h4>
        <div className="container">Some util</div>
      </div>
    );
  }
}
