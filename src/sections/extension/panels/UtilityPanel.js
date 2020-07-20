import React from "react";
import PropTypes from "prop-types";

import "./UtilityPanel.css";

export class UtilityPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid utility-panel">Utility Panel content</div>
    );
  }
}
UtilityPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
