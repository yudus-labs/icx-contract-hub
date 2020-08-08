import React from "react";
import ReactGA from "react-ga";

import { HeaderSection } from "./sections/header/HeaderSection.js";
import { ExtensionSection } from "./sections/extension/ExtensionSection.js";
import { HistorySection } from "./sections/history/HistorySection.js";
import { CallSection } from "./sections/call/CallSection.js";

import "./ContractHub.css";

const NETWORKS = [
  {
    name: "Mainnet",
    loopchain_endpoint: "https://ctz.solidwallet.io/api/v3",
    chainalytic_endpoint: "https://yudus.dev/chainalytic-icon/api/mainnet",
    network_id: "1",
  },
  {
    name: "Testnet",
    loopchain_endpoint: "https://bicon.net.solidwallet.io/api/v3",
    chainalytic_endpoint: "https://yudus.dev/chainalytic-icon/api/testnet",
    network_id: "3",
  },
  {
    name: "Local",
    loopchain_endpoint: "http://localhost:9000/api/v3",
    chainalytic_endpoint: "http://localhost:5600",
    network_id: "0",
  },
  {
    name: "Custom",
    loopchain_endpoint: "http://custom_loopchain_endpoint",
    chainalytic_endpoint: "http://custom_chainalytic_endpoint",
    network_id: "0",
  },
];

// const DEFAULT_CONTRACT = "cx69bcdf1753472c1444188ec3f5188657e30c8322"; // broof
const DEFAULT_CONTRACT = "cxd47f7d943ad76a0403210501dab03d4daf1f6864"; // iconbet

const ContractHubContext = React.createContext();
HeaderSection.contextType = ContractHubContext;
ExtensionSection.contextType = ContractHubContext;
HistorySection.contextType = ContractHubContext;
CallSection.contextType = ContractHubContext;

ReactGA.initialize("UA-169204893-3");
ReactGA.pageview(window.location.pathname + window.location.search);

class ContractHub extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allNetworks: NETWORKS,
      network: NETWORKS[0],
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
    // console.log(data);
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
