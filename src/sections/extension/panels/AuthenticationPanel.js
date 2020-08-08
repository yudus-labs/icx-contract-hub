import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { IconApi } from "../../../chainApi/IconApi.js";

import "./AuthenticationPanel.css";

const CURRENT_ICONEX_WALLET_KEY = "current_iconex_wallet";

function PKey(props) {
  const handlePKeyChange = (event) => {
    const hubState = props.hubState;
    hubState.auth.pkey = event.target.value;
    props.updateHubState(hubState);
  };

  return (
    <div className="row my-1">
      <div className="col">
        <input
          type="text"
          className="form-control"
          value={props.hubState.auth.pkey}
          onChange={handlePKeyChange}
          placeholder="Enter contract owner private key here"
        />
      </div>
    </div>
  );
}

function Keystore(props) {
  const handleKeystoreChange = (event) => {
    const hubState = props.hubState;
    hubState.auth.keystore = event.target.value;
    props.updateHubState(hubState);
  };

  return (
    <div className="row my-1">
      <div className="col">
        <input
          type="text"
          className="form-control"
          value={props.hubState.auth.keystore}
          onChange={handleKeystoreChange}
          placeholder="or contract owner keystore content here"
        />
      </div>
    </div>
  );
}

function KeystorePass(props) {
  const handleKeystorePassChange = (event) => {
    const hubState = props.hubState;
    hubState.auth.keystorePass = event.target.value;
    props.updateHubState(hubState);
  };
  return (
    <div className="row my-1">
      <div className="col">
        <input
          type="password"
          className="form-control"
          value={props.hubState.auth.keystorePass}
          onChange={handleKeystorePassChange}
          placeholder="and keystore password"
        />
      </div>
    </div>
  );
}

function IconexConnect(props) {
  const loginIconex = () => {
    const api = new IconApi({ endpoint: "", nid: "", contract: "" });
    api.iconexAskAddress().then((address) => {
      if (address) {
        const hubState = props.hubState;
        hubState.auth.iconexWallet = address;
        props.updateHubState(hubState);
        localStorage.setItem(CURRENT_ICONEX_WALLET_KEY, address);
      }
    });
  };

  const logoutIconex = () => {
    const hubState = props.hubState;
    hubState.auth.iconexWallet = "";
    props.updateHubState(hubState);
    localStorage.setItem(CURRENT_ICONEX_WALLET_KEY, "");
  };

  return (
    <div className="container">
      <div className="row my-1">
        <div className="col">
          <div className="row align-items-center">
            <div
              type="button"
              className="btn btn-primary btn-sm hub-btn-primary"
              onClick={
                props.hubState.auth.iconexWallet ? logoutIconex : loginIconex
              }
            >
              {props.hubState.auth.iconexWallet
                ? "Disconnect ICONex"
                : "Connect ICONex"}
            </div>

            {props.hubState.auth.iconexWallet ? (
              <div className="iconex-wallet-address mx-2">
                {props.hubState.auth.iconexWallet}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthenticationPanel(props) {
  useEffect(() => {
    const iconexWallet = localStorage.getItem(CURRENT_ICONEX_WALLET_KEY);
    if (iconexWallet) {
      const hubState = props.hubState;
      hubState.auth.iconexWallet = iconexWallet;
      props.updateHubState(hubState);
    }
  }, []);

  return (
    <div className="container-fluid authentication-panel">
      <div className="row my-1">
        <div className="col-auto">
          <div className="alert alert-info" role="alert">
            You need contract owner access to make <b>writable</b> contract
            calls. On testnet or local network, it should be fine and more
            convenient to use keystore/private key directly
          </div>
        </div>
      </div>
      <PKey hubState={props.hubState} updateHubState={props.updateHubState} />
      <br />
      <Keystore
        hubState={props.hubState}
        updateHubState={props.updateHubState}
      />
      <KeystorePass
        hubState={props.hubState}
        updateHubState={props.updateHubState}
      />
      <br />
      <div className="row my-1 align-items-center">
        <div className="col-auto">
          <div className="alert alert-info" role="alert">
            However, on mainnet, we strongly recommend login via ICONex
          </div>
        </div>
        <div className="col-auto">
          <IconexConnect
            hubState={props.hubState}
            updateHubState={props.updateHubState}
          />
        </div>
      </div>
      <br />
      <div className="row my-1">
        <div className="col-auto">
          <div className="alert alert-info" role="alert">
            If you prefer to use offline, just get the source here{" "}
            <a
              href="https://github.com/yudus-lab/icx-contract-explorer"
              alt="ICX Contract Explorer"
              className="custom-link"
            >
              https://github.com/yudus-lab/icx-contract-explorer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

AuthenticationPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
