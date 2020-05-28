import React from "react";
import "./css/ContractApi.css";
import IconService from "icon-sdk-js";

export class ApiItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      methodName: props.methodName,
      methodParams: props.methodParams,
      readonly: props.readonly,
      paramValues: {},
    };
  }

  handleClick = async () => {
    if (this.state.readonly) {
      this.call(this.state.methodName, this.state.paramValues);
    } else {
      this.sendCallTx(this.state.methodName, this.state.paramValues);
    }
  };

  updateParamValue = (param, value) => {
    const paramValues = {};
    paramValues[param] = value;
    this.setState({ paramValues: paramValues });
  };

  async call(method, params) {
    console.log(`Calling method: ${method}`);
    console.log(`..with params: ${JSON.stringify(params)}`);

    let result = "";

    try {
      const provider = new IconService.HttpProvider(
        this.context.explorerState.endpoint
      );
      const iconService = new IconService(provider);
      const call = new IconService.IconBuilder.CallBuilder()
        .to(this.context.explorerState.contract)
        .method(method)
        .params(params)
        .build();
      result = await iconService.call(call).execute();
    } catch (err) {
      result = err;
    }

    this.context.updateExplorerState({
      callResult: result,
      callTx: "",
      lastCall: this.state.methodName,
    });
    console.log("Call result: " + result);
  }

  async sendCallTx(method, params) {
    console.log(`Calling method: ${method}`);
    console.log(`..with params: ${JSON.stringify(params)}`);

    let txHash = "";

    try {
      const provider = new IconService.HttpProvider(
        this.context.explorerState.endpoint
      );
      const iconService = new IconService(provider);

      const wallet = IconService.IconWallet.loadPrivateKey(
        this.context.explorerState.pkey
      );

      const transaction = new IconService.IconBuilder.CallTransactionBuilder()
        .from(this.context.explorerState.owner)
        .to(this.context.explorerState.contract)
        .stepLimit(IconService.IconConverter.toBigNumber("5000000000"))
        .nid(IconService.IconConverter.toBigNumber("3"))
        .nonce(IconService.IconConverter.toBigNumber("1"))
        .version(IconService.IconConverter.toBigNumber("3"))
        .timestamp(new Date().getTime() * 1000)
        .method(method)
        .params(params)
        .build();

      const signedTx = new IconService.SignedTransaction(transaction, wallet);

      txHash = await iconService.sendTransaction(signedTx).execute();
    } catch (err) {
      txHash = err;
    }

    this.context.updateExplorerState({
      callResult: "",
      callTx: txHash,
      lastCall: this.state.methodName,
    });

    console.log("Call Tx: " + txHash);
  }

  render() {
    return (
      <div className="row my-3 ApiItem">
        <div className="container">
          <div className="row">
            <div
              type="button"
              className="btn btn-primary btn-block api-button"
              onClick={this.handleClick}
            >
              {this.state.methodName}
            </div>
          </div>

          {this.state.methodParams.length > 0 ? (
            this.state.methodParams.map((param, index) => (
              <div className="row my-1" key={index}>
                <div className="col">
                  <div className="row">
                    <div className="col-auto">
                      <var>{param.name}</var> : <code>{param.type}</code>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.paramValues[param.name] || ""}
                        onChange={(e) =>
                          this.updateParamValue(param.name, e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="row my-1">
              <div className="col">No params</div>
            </div>
          )}
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
      .map((item) => ({ methodName: item.name, methodParams: item.inputs }));
    this.setState({ methods: methods });

    const readonlyMethods = apiList
      .getList()
      .filter((item) => item.type === "function")
      .filter((item) => item.hasOwnProperty("readonly"))
      .map((item) => ({ methodName: item.name, methodParams: item.inputs }));
    this.setState({ readonlyMethods: readonlyMethods });

    // console.log("API list: " + JSON.stringify(apiList.getList(), null, 2));
    // console.log("API list: " + JSON.stringify(methods, null, 2));
  }

  lsMethods() {
    return this.state.methods.map((item, index) => (
      <ApiItem
        methodName={item.methodName}
        methodParams={item.methodParams}
        readonly={false}
        key={index}
      />
    ));
  }

  lsReadonlyMethods() {
    return this.state.readonlyMethods.map((item, index) => (
      <ApiItem
        methodName={item.methodName}
        methodParams={item.methodParams}
        readonly={true}
        key={index}
      />
    ));
  }

  render() {
    return (
      <div className="container ContractApi">
        <h4>{this.state.title}</h4>
        <div className="container">
          <div className="row">
            <div className="col">
              <h5>Readonly methods</h5>
              <div className="container">{this.lsReadonlyMethods()}</div>
            </div>
            <div className="col">
              <h5>Writable methods</h5>
              <div className="container">{this.lsMethods()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
