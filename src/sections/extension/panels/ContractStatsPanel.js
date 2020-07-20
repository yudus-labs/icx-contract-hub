import React from "react";
import PropTypes from "prop-types";

import "./ContractStatsPanel.css";

export class ContractStatsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid contract-stats-panel">
        Contract Stats Panel content
      </div>
    );
  }
}
ContractStatsPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
