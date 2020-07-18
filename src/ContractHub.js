import React from "react";
import ReactGA from "react-ga";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { HeaderSection } from "./sections/header/HeaderSection.js";
import { ExtensionSection } from "./sections/extension/ExtensionSection.js";
import { HistorySection } from "./sections/history/HistorySection.js";
import { CallSection } from "./sections/call/CallSection.js";

import "./css/ContractHub.css";

const LOGO = require("./images/yudus-lab-1-small.png");

const TITLE = "ICX Contract Hub";
const SUB_TITLE = "For ICON developers - By Yudus Lab";
const COPYRIGHT = "v0.3.0 - © 2020";
const DEFAULT_CONTRACT = "cx69bcdf1753472c1444188ec3f5188657e30c8322"; // broof

const ContractHubContext = React.createContext();

// ReactGA.initialize("UA-169204893-3");
// ReactGA.pageview(window.location.pathname + window.location.search);

class ContractHub extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateHubState = (data) => {
    this.setState(data);
  };

  render() {
    return (
      <div className="container-fluid contract-hub">
        <ContractHubContext.Provider
          value={{
            hubState: this.state,
            updateHubState: this.updateHubState,
          }}
        >
          <HeaderSection />
          <ExtensionSection />
          <HistorySection />
          <CallSection />
        </ContractHubContext.Provider>
      </div>
    );
  }
}

export default ContractHub;
