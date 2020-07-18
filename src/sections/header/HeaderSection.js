import React from "react";

import "../../css/HeaderSection.css";

export class HeaderSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid header-section">ICX Contract Hub</div>
    );
  }
}
