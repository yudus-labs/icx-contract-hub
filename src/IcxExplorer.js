import React from "react";
import ReactGA from "react-ga";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Auth } from "./Auth.js";
import { Utility, CheckTx } from "./Utility.js";
import { ContractApi, ApiItem } from "./ContractApi.js";
import "./css/IcxExplorer.css";

const LOGO = require("./images/yudus-lab-1-small.png");

const ExplorerContext = React.createContext();
Auth.contextType = ExplorerContext;
Utility.contextType = ExplorerContext;
CheckTx.contextType = ExplorerContext;
ApiItem.contextType = ExplorerContext;
ContractApi.contextType = ExplorerContext;

const TITLE = "ICX Contract Explorer";
const SUB_TITLE = "dedicated for ICON contract developers";
const COPYRIGHT = "© 2020";

const CUSTOM_ENDPOINT = "http://please_enter_your_custom_network";
const TESTNET_ENDPOINT = "https://bicon.net.solidwallet.io/api/v3";
const MAINNET_ENDPOINT = "https://ctz.solidwallet.io/api/v3";
const CUSTOM_NID = "0";
const TESTNET_NID = "3";
const MAINNET_NID = "1";
// const DEFAULT_CONTRACT = "cxa6ba8f0730ad952b5898ac3e5e90a17e20574eff";
const DEFAULT_CONTRACT = "";

ReactGA.initialize("UA-169204893-3");
ReactGA.pageview(window.location.pathname + window.location.search);

function Header(props) {
  return (
    <div className="container-fluid" id="IcxExplorer-header">
      <div className="row">
        {/* Title */}
        <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
              <header id="IcxExplorer-title">{TITLE}</header>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
              <br />
              <span id="IcxExplorer-subtitle">{SUB_TITLE}</span>
            </div>
          </div>

          <div className="row" id="IcxExplorer-copyright">
            <div className="col">
              <a href="https://yudus.dev">
                <img
                  src={LOGO}
                  id="IcxExplorer-copyright-logo"
                  alt="Yudus Valley"
                />
              </a>
              {COPYRIGHT}
            </div>
          </div>
        </div>

        {/* Endpoint */}
        <div
          className="col-lg-6 col-md-12 col-sm-12 col-xs-12"
          id="IcxExplorer-endpoint"
        >
          <div className="row">
            <div className="col-lg-9 col-md-9 col-sm-8 col-xs-12">
              <input
                type="text"
                className="form-control"
                id="endpoint-input"
                value={props.endpoint}
                onChange={(e) =>
                  props.handleEndpointChange(e.target.value, TESTNET_NID)
                }
              />
            </div>

            <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12 text-right">
              <div className="dropdown">
                <button
                  className="btn btn-primary btn-sm dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Choose endpoint
                </button>
                <div
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="dropdownMenuButton"
                >
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() =>
                      props.handleEndpointChange(MAINNET_ENDPOINT, MAINNET_NID)
                    }
                  >
                    Mainnet
                  </button>

                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() =>
                      props.handleEndpointChange(TESTNET_ENDPOINT, TESTNET_NID)
                    }
                  >
                    Testnet
                  </button>

                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() =>
                      props.handleEndpointChange(CUSTOM_ENDPOINT, CUSTOM_NID)
                    }
                  >
                    Custom
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

class IcxExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: MAINNET_ENDPOINT,
      nid: MAINNET_NID,
      pkey: "",
      keystore: "",
      keystorePass: "",
      contract: DEFAULT_CONTRACT,
    };
  }

  updateExplorerState = (data) => {
    this.setState(data);
  };

  handleEndpointChange = (newEndpoint, newNid) => {
    this.setState({ endpoint: newEndpoint, nid: newNid });
  };

  render() {
    return (
      <div className="container-fluid IcxExplorer">
        <Header
          endpoint={this.state.endpoint}
          handleEndpointChange={this.handleEndpointChange}
        />

        <ExplorerContext.Provider
          value={{
            explorerState: {
              endpoint: this.state.endpoint,
              nid: this.state.nid,
              pkey: this.state.pkey,
              keystore: this.state.keystore,
              keystorePass: this.state.keystorePass,
              contract: this.state.contract,
            },
            updateExplorerState: this.updateExplorerState,
          }}
        >
          <div className="container-fluid" id="IcxExplorer-body">
            <br />
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <Auth title="Authentication" />
                <br />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <Utility title="Utilities" />
              </div>
            </div>
            <br />

            <div className="row">
              <div className="col">
                <ContractApi title="Contract APIs" />
              </div>
            </div>
            <br />
          </div>
        </ExplorerContext.Provider>
      </div>
    );
  }
}

export default IcxExplorer;
