import React from "react";
import "./css/UserSetting.css";

export class UserSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      endpoint: props.endpoint,
      pkey: props.pkey,
      contract: props.contract,
    };
  }

  handleEndpointChange = (event) => {
    const data = { endpoint: event.target.value };
    this.context.updateExplorerState(data);
    this.setState(data);
  };

  handlePKeyChange = (event) => {
    const data = { pkey: event.target.value };
    this.context.updateExplorerState(data);
    this.setState(data);
  };
  handleContractChange = (event) => {
    const data = { contract: event.target.value };
    this.context.updateExplorerState(data);
    this.setState(data);
  };

  Endpoint = () => {
    return (
      <div className="row my-1">
        <div className="col-sm-2">
          <span className="inline-span">Endpoint</span>
        </div>

        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            value={this.state.endpoint}
            onChange={this.handleEndpointChange}
          />
        </div>
      </div>
    );
  };

  PKey = () => {
    return (
      <div className="row my-1">
        <div className="col-sm-2">
          <span className="inline-span">Owner Private Key</span>
        </div>

        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            value={this.state.pkey}
            onChange={this.handlePKeyChange}
          />
        </div>
      </div>
    );
  };

  Contract = () => {
    return (
      <div className="row my-1">
        <div className="col-sm-2">
          <span className="inline-span">Contract</span>
        </div>

        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            value={this.state.contract}
            onChange={this.handleContractChange}
          />
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="container UserSetting">
        <h4>{this.state.title}</h4>
        <div className="container">
          <this.Endpoint />
          <this.PKey />
          <this.Contract />
        </div>
      </div>
    );
  }
}
