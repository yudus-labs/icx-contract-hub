import React from "react";
import "./css/ContractApi.css";
import IconService from "icon-sdk-js";

export class ApiItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      methodName: props.methodName,
      methodParams: "{}",
    };
  }

  handleClick = async () => {
    this.call(this.state.methodName, this.state.methodParams);
  };

  handleChange = (event) => {
    this.setState({ methodParams: event.target.value });
  };

  async call(method, params) {
    console.log(`Calling method: ${method}`);
    console.log(`..with params: ${params}`);

    const provider = new IconService.HttpProvider(
      this.context.explorerState.endpoint
    );
    const iconService = new IconService(provider);
    const call = new IconService.IconBuilder.CallBuilder()
      .to(this.context.explorerState.contract)
      .method(method)
      .params(JSON.parse(params))
      .build();
    const result = await iconService.call(call).execute();

    this.context.updateExplorerState({
      callResult: result,
      lastCall: this.state.methodName,
    });

    console.log("Call result: " + result);
  }

  render() {
    return (
      <div className="row my-1 ApiItem">
        <div className="col-sm-3">
          <div
            type="button"
            className="btn btn-primary"
            onClick={this.handleClick}
          >
            {this.state.methodName}
          </div>
        </div>

        <div className="col-sm-9">
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
    this.state = {
      title: props.title,
      readonlyMethods: [],
      methods: [],
    };
  }

  async componentDidMount() {
    await this.fetchMethods();
  }

  async fetchMethods() {
    const provider = new IconService.HttpProvider(
      this.context.explorerState.endpoint
    );
    const iconService = new IconService(provider);
    const apiList = await iconService
      .getScoreApi(this.context.explorerState.contract)
      .execute();

    const methods = apiList
      .getList()
      .filter((item) => item.type === "function")
      .filter((item) => !item.hasOwnProperty("readonly"))
      .map((item) => item.name);
    this.setState({ methods: methods });

    const readonlyMethods = apiList
      .getList()
      .filter((item) => item.type === "function")
      .filter((item) => item.hasOwnProperty("readonly"))
      .map((item) => item.name);
    this.setState({ readonlyMethods: readonlyMethods });

    console.log("API list: " + JSON.stringify(apiList.getList(), null, 2));
    // console.log("API list: " + JSON.stringify(methods, null, 2));
  }

  lsMethods() {
    return this.state.methods.map((item) => (
      <ApiItem methodName={item} key={item} />
    ));
  }

  lsReadonlyMethods() {
    return this.state.readonlyMethods.map((item) => (
      <ApiItem methodName={item} key={item} />
    ));
  }

  render() {
    return (
      <div className="container ContractApi">
        <h4>{this.state.title}</h4>
        <h5>Readonly methods</h5>
        <div className="container">{this.lsReadonlyMethods()}</div>
        <br />
        <h5>Writable methods</h5>
        <div className="container">{this.lsMethods()}</div>
      </div>
    );
  }
}
