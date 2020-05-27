import React from "react";
import "./css/ContractApi.css";

export class ApiItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      methodName: props.methodName,
      methodParams: "Parameters here",
      callResult: "Call result",
    };
  }

  handleClick = () => {
    this.context.updateExplorerState({
      callResult: this.state.methodParams,
      lastCall: this.state.methodName,
    });

    this.setState((state) => {
      return { callResult: state.methodParams };
    });
  };

  handleChange = (event) => {
    this.setState({ methodParams: event.target.value });
  };

  render() {
    return (
      <div className="row my-1 ApiItem">
        <div className="col-sm-2">
          <div
            type="button"
            className="btn btn-primary api-button"
            onClick={this.handleClick}
          >
            {this.state.methodName}
          </div>
        </div>

        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            value={this.state.methodParams}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

/**
 * Contain list of API and params input
 */
export class ContractApi extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: props.title };
  }

  lsApi() {
    const apiList = ["about", "ls_players", "ls_next_draw_bh"];
    return apiList.map((item) => <ApiItem methodName={item} key={item} />);
  }
  render() {
    return (
      <div className="container ContractApi">
        <h4>{this.state.title}</h4>
        <div className="container">{this.lsApi()}</div>
      </div>
    );
  }
}
