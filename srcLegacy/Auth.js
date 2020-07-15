import React from "react";
import { IconApi } from "./IconApi.js";
import "./css/Auth.css";

const CURRENT_ICONEX_WALLET_KEY = "current_iconex_wallet";

export class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
    };
  }
  componentDidMount() {
    const iconexWallet = localStorage.getItem(CURRENT_ICONEX_WALLET_KEY);
    if (iconexWallet) {
      const data = { iconexWallet: iconexWallet };
      this.context.updateExplorerState(data);
      this.setState(data);
    }
  }

  handlePKeyChange = (event) => {
    const data = { pkey: event.target.value };
    this.context.updateExplorerState(data);
    this.setState(data);
  };

  PKey = () => {
    return (
      <div className="row my-1">
        <div className="col">
          <input
            type="text"
            className="form-control"
            value={this.context.explorerState.pkey}
            onChange={this.handlePKeyChange}
            placeholder="Enter contract owner private key here"
          />
        </div>
      </div>
    );
  };

  handleKeystoreChange = (event) => {
    const data = { keystore: event.target.value };
    this.context.updateExplorerState(data);
    this.setState(data);
  };

  Keystore = () => {
    return (
      <div className="row my-1">
        <div className="col">
          <input
            type="text"
            className="form-control"
            value={this.context.explorerState.keystore}
            onChange={this.handleKeystoreChange}
            placeholder="or contract owner keystore content here"
          />
        </div>
      </div>
    );
  };

  handleKeystorePassChange = (event) => {
    const data = { keystorePass: event.target.value };
    this.context.updateExplorerState(data);
    this.setState(data);
  };

  KeystorePass = () => {
    return (
      <div className="row my-1">
        <div className="col">
          <input
            type="password"
            className="form-control"
            value={this.context.explorerState.keystorePass}
            onChange={this.handleKeystorePassChange}
            placeholder="and keystore password"
          />
        </div>
      </div>
    );
  };

  loginIconex = () => {
    const api = new IconApi({ endpoint: "", nid: "", contract: "" });
    api.iconexAskAddress().then((address) => {
      if (address) {
        const data = { iconexWallet: address };
        this.context.updateExplorerState(data);
        this.setState(data);
        localStorage.setItem(CURRENT_ICONEX_WALLET_KEY, address);
      }
    });
  };

  logoutIconex = () => {
    const data = { iconexWallet: "" };
    this.context.updateExplorerState(data);
    this.setState(data);
    localStorage.setItem(CURRENT_ICONEX_WALLET_KEY, "");
  };

  IconexConnect = () => {
    return (
      <div className="container">
        <div className="row my-1">
          <div className="col">
            <div className="row">
              <div
                type="button"
                className="btn btn-primary btn-sm"
                onClick={
                  this.state.iconexWallet ? this.logoutIconex : this.loginIconex
                }
              >
                {this.state.iconexWallet
                  ? "Disconnect ICONex"
                  : "Connect ICONex"}
              </div>

              {this.state.iconexWallet ? (
                <div className="iconex-wallet mx-2">
                  {this.state.iconexWallet}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="container Auth">
        <h4 id="Auth-title">{this.state.title}</h4>
        <div className="container">
          <div className="row my-1">
            <div className="col-auto">
              <div className="alert alert-info" role="alert">
                You need contract owner access to make <b>writable</b> contract
                calls. On testnet or local network, it should be fine and more
                convenient to use keystore/private key directly
              </div>
            </div>
          </div>
          <this.PKey />
          <br />
          <this.Keystore />
          <this.KeystorePass />
          <br />
          <div className="row my-1">
            <div className="col-auto">
              <div className="alert alert-info" role="alert">
                However, on mainnet, we strongly recommend login via ICONex
              </div>
            </div>
          </div>
          <this.IconexConnect />
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
      </div>
    );
  }
}
