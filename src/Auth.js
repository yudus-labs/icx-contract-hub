import React from "react";
import "./css/Auth.css";

export class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
    };
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

  render() {
    return (
      <div className="container Auth">
        <h4 id="Auth-title">{this.state.title}</h4>
        <div className="container">
          <div className="row my-1">
            <div className="col-auto">
              <div className="alert alert-info" role="alert">
                You need contract owner access to make <b>writable</b> contract
                calls, use at your own risk
                <br />
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
          <this.PKey />
          <br />
          <this.Keystore />
          <this.KeystorePass />
        </div>
      </div>
    );
  }
}
