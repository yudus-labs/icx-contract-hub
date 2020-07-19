import React from "react";
import ReactGA from "react-ga";

import { HeaderSection } from "./sections/header/HeaderSection.js";
import { ExtensionSection } from "./sections/extension/ExtensionSection.js";
import { HistorySection } from "./sections/history/HistorySection.js";
import { CallSection } from "./sections/call/CallSection.js";

import "./ContractHub.css";

const NETWORKS = {
  CUSTOM: {
    LOOPCHAIN_ENDPOINT: "http://custom_loopchain_endpoint",
    CHAINALYTIC_ENDPOINT: "http://custom_chainalytic_endpoint",
    NETWORK_ID: "0",
  },
  LOCAL: {
    LOOPCHAIN_ENDPOINT: "http://localhost:9000/api/v3",
    CHAINALYTIC_ENDPOINT: "http://localhost:5600",
    NETWORK_ID: "0",
  },
  TESTNET: {
    LOOPCHAIN_ENDPOINT: "https://bicon.net.solidwallet.io/api/v3",
    CHAINALYTIC_ENDPOINT: "https://yudus.dev/chainalytic-icon/api/testnet",
    NETWORK_ID: "3",
  },
  MAINNET: {
    LOOPCHAIN_ENDPOINT: "https://ctz.solidwallet.io/api/v3",
    CHAINALYTIC_ENDPOINT: "https://yudus.dev/chainalytic-icon/api/mainnet",
    NETWORK_ID: "1",
  },
};

const DEFAULT_CONTRACT = "cx69bcdf1753472c1444188ec3f5188657e30c8322"; // broof

const ContractHubContext = React.createContext();
HeaderSection.contextType = ContractHubContext;
ExtensionSection.contextType = ContractHubContext;
HistorySection.contextType = ContractHubContext;
CallSection.contextType = ContractHubContext;

// ReactGA.initialize("UA-169204893-3");
// ReactGA.pageview(window.location.pathname + window.location.search);

class ContractHub extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      network: NETWORKS.MAINNET,
      auth: {
        pkey: "",
        keystore: "",
        keystorePass: "",
        iconexWallet: "",
      },
      contract: DEFAULT_CONTRACT,
    };
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
