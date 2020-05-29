import React from "react";
import "./css/Auth.css";

export class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      owner: props.owner,
      pkey: props.pkey,
    };
  }

  handleOwnerChange = (event) => {
    const data = { owner: event.target.value };
    this.context.updateExplorerState(data);
    this.setState(data);
  };

  handlePKeyChange = (event) => {
    const data = { pkey: event.target.value };
    this.context.updateExplorerState(data);
    this.setState(data);
  };

  Owner = () => {
    return (
      <div className="row my-1">
        <div className="col-sm-2">
          <span className="inline-span">Owner Address</span>
        </div>

        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            value={this.state.owner}
            onChange={this.handleOwnerChange}
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

  render() {
    return (
      <div className="container Auth">
        <h4>{this.state.title}</h4>
        <div className="container">
          <this.Owner />
          <this.PKey />
        </div>
      </div>
    );
  }
}
