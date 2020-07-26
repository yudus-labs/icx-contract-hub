import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { ChainalyticApi } from "../../../chainApi/ChainalyticApi.js";

import "./InternalTransactionPanel.css";

export function InternalTransactionPanel(props) {
  return (
    <div className="container-fluid internal-transaction-panel">
      Internal Transaction Panel content
    </div>
  );
}

InternalTransactionPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
