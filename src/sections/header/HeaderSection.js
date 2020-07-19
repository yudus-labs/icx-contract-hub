import React from "react";
import PropTypes from "prop-types";

import { HorizonalSeparator } from "../../common/Util";
import "./HeaderSection.css";

const TITLE = "ICX Contract Hub";
const SUB_TITLE = "For ICON developers - By Yudus Lab";
const COPYRIGHT = "v0.3.0 - © 2020";

function TitlePanel(props) {
  return (
    <div className="container title-panel">
      <div id="main-title">{TITLE}</div>
      <HorizonalSeparator width={"320px"} />
      <div id="sub-title">{SUB_TITLE}</div>
      <div id="copyright">{COPYRIGHT}</div>
    </div>
  );
}

function ChooseNetworkDropdown(props) {
  return (
    <div className="row justify-content-end choose-network-dropdown">
      <div className="dropdown">
        <button
          className="btn btn-primary btn-sm dropdown-toggle hub-btn-primary"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Choose network
        </button>
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="dropdownMenuButton"
        >
          {props.allNetworks.map((network) => (
            <button
              className="dropdown-item"
              type="button"
              onClick={() => props.handleNetworkChange(network)}
              key={network.name}
            >
              {network.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
ChooseNetworkDropdown.propTypes = {
  allNetworks: PropTypes.arrayOf(PropTypes.object),
  handleNetworkChange: PropTypes.func,
};

function LoopchainInfo(props) {
  return (
    <div className="row align-items-center justify-content-end loopchain-info">
      <div className="col-auto">Loopchain</div>
      <div className="col">
        <input
          type="text"
          className="form-control endpoint-input"
          value={props.network.loopchain_endpoint}
          onChange={(e) => {
            const network = props.network;
            network.loopchain_endpoint = e.target.value;
            props.handleNetworkChange(network);
          }}
          required={true}
          placeholder="Loopchain endpoint here"
        />
      </div>
      <div className="col-auto">Height 10,000,000</div>
    </div>
  );
}
LoopchainInfo.propTypes = {
  network: PropTypes.object,
  handleNetworkChange: PropTypes.func,
};

function ChainalyticInfo(props) {
  return (
    <div className="row align-items-center justify-content-end chainalytic-info">
      <div className="col-auto">Chainalytic</div>
      <div className="col">
        <input
          type="text"
          className="form-control endpoint-input"
          value={props.network.chainalytic_endpoint}
          onChange={(e) => {
            const network = props.network;
            network.chainalytic_endpoint = e.target.value;
            props.handleNetworkChange(network);
          }}
          required={true}
          placeholder="Chainalytic endpoint here"
        />
      </div>
      <div className="col-auto">Height 9,999,990</div>
    </div>
  );
}
ChainalyticInfo.propTypes = {
  network: PropTypes.object,
  handleNetworkChange: PropTypes.func,
};

function NetworkIdInfo(props) {
  return (
    <div className="row align-items-center justify-content-end network-id-info">
      <div className="col-auto">Network ID</div>
      <div className="col-2">
        <input
          type="text"
          className="form-control endpoint-input"
          value={props.network.network_id}
          onChange={(e) => {
            const network = props.network;
            network.network_id = e.target.value;
            props.handleNetworkChange(network);
          }}
          required={true}
          placeholder="Network ID"
        />
      </div>
    </div>
  );
}
NetworkIdInfo.propTypes = {
  network: PropTypes.object,
  handleNetworkChange: PropTypes.func,
};

function IconexInfo(props) {
  return (
    <div className="row justify-content-end iconex-info">
      {props.iconexWallet ? (
        <div className="succeed-label">ICONex connected</div>
      ) : (
        <div className="failed-label">ICONex disconnected</div>
      )}
    </div>
  );
}
IconexInfo.propTypes = {
  iconexWallet: PropTypes.string,
};

function SettingPanel(props) {
  return (
    <div className="container setting-panel">
      <ChooseNetworkDropdown
        allNetworks={props.allNetworks}
        handleNetworkChange={props.handleNetworkChange}
      />
      <NetworkIdInfo
        network={props.network}
        handleNetworkChange={props.handleNetworkChange}
      />
      <LoopchainInfo
        network={props.network}
        handleNetworkChange={props.handleNetworkChange}
      />
      <ChainalyticInfo
        network={props.network}
        handleNetworkChange={props.handleNetworkChange}
      />
      <IconexInfo iconexWallet={props.iconexWallet} />
    </div>
  );
}
SettingPanel.propTypes = {
  allNetworks: PropTypes.arrayOf(PropTypes.object),
  network: PropTypes.object,
  handleNetworkChange: PropTypes.func,
  iconexWallet: PropTypes.string,
};

export class HeaderSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleNetworkChange = (network) => {
    this.context.updateHubState({ network: network });
  };

  render() {
    return (
      <div className="container-fluid section-block header-section">
        <div className="row">
          <div className="col-6">
            <TitlePanel />
          </div>
          <div className="col-6">
            <SettingPanel
              allNetworks={this.context.hubState.allNetworks}
              network={this.context.hubState.network}
              handleNetworkChange={this.handleNetworkChange}
              iconexWallet={this.context.hubState.auth.iconexWallet}
            />
          </div>
        </div>
      </div>
    );
  }
}
