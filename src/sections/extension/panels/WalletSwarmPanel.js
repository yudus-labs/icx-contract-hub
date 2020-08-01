import React from "react";
import PropTypes from "prop-types";

import "./WalletSwarmPanel.css";

export class WalletSwarmPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid wallet-swarm-panel">
        Coming soon...
      </div>
    );
  }
}
WalletSwarmPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
