import React from "react";
import "./IcxExplorer.css";

const ExplorerContext = React.createContext();

class ApiItem extends React.Component {
  static contextType = ExplorerContext;
  constructor(props) {
    super(props);
    this.state = {
      api_id: props.api_id,
      api_params: "Parameters here",
      callResult: "Call result",
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {
    console.log(this.state.api_params);
    this.context.updateValue({ callResult: this.state.api_params });

    this.setState((state) => {
      return { callResult: state.api_params };
    });
  }

  handleChange(event) {
    this.setState({ api_params: event.target.value });
  }

  render() {
    return (
      <div className="d-flex flex-row my-1 ApiItem">
        <div
          type="button"
          className="btn btn-primary mx-1 api-button"
          onClick={this.handleClick}
        >
          {this.state.api_id}
        </div>
        <input
          type="text"
          className="form-control mx-1"
          value={this.state.api_params}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

/**
 * Contain list of API and params input
 */
class ContractApi extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: props.title };
  }

  lsApi() {
    const apiList = ["about", "ls_players"];
    return apiList.map((item) => <ApiItem api_id={item} key={item} />);
  }
  render() {
    return (
      <div className="container ContractApi">
        <h4>{this.state.title}</h4>
        <div className="d-flex flex-column">{this.lsApi()}</div>
      </div>
    );
  }
}

class CallResult extends React.Component {
  static contextType = ExplorerContext;
  constructor(props) {
    super(props);
    this.state = { title: props.title };
  }

  render() {
    console.log("Call result: " + this.context.value.callResult);
    return (
      <div className="container CallResult">
        <h4>{this.state.title}</h4>
        <div className="d-flex flex-column">
          <textarea value={this.context.value.callResult} readOnly={true} />
        </div>
      </div>
    );
  }
}

class IcxExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { callResult: "Default call result" };
    this.updateExplorerState = this.updateExplorerState.bind(this);
  }

  updateExplorerState(data) {
    this.setState(data);
  }

  render() {
    return (
      <div className="container">
        <header id="IcxExplorer-header" className="my-2">
          Icx Explorer Lite
        </header>

        <ExplorerContext.Provider
          value={{
            value: { callResult: this.state.callResult },
            updateValue: this.updateExplorerState,
          }}
        >
          <div className="container" id="IcxExplorer-body">
            <ContractApi title="Contract APIs" />
            <br />
            <CallResult title="Contract call result" />
            <br />
          </div>
        </ExplorerContext.Provider>
      </div>
    );
  }
}

export default IcxExplorer;
