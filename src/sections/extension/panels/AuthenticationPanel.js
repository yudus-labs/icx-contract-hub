import React from "react";
import PropTypes from "prop-types";

import "./AuthenticationPanel.css";

export class AuthenticationPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid authentication-panel">
        Auth Panel content
      </div>
    );
  }
}
AuthenticationPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
