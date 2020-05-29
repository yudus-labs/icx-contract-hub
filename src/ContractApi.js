import React from "react";
import "./css/ContractApi.css";
import IconService from "icon-sdk-js";

function Output(props) {
  return (
    <div className="container">
      {props.txHash ? (
        <div className="row">
          <div className="col">
            <br />
            <div
              type="button"
              className="btn btn-secondary checktx-button"
              onClick={props.checkTx}
            >
              TX hash below, click here to check its result
            </div>

            <textarea
              value={props.txHash}
              readOnly={true}
              rows="1"
              className="form-control text-area"
            />
            <br />
          </div>
        </div>
      ) : (
        ""
      )}

      {props.callResult ? (
        <div className="row">
          <div className="col">
            {props.txHash ? "" : <br />}
            <h6>Call / Tx result</h6>
            <textarea
              value={JSON.stringify(props.callResult, null, 2)}
              readOnly={true}
              rows="4"
              className="form-control text-area"
            />
            <br />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export class ApiItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      methodName: props.methodName,
      methodParams: props.methodParams,
      readonly: props.readonly,
      paramValues: {},
      txHash: "",
      callResult: "",
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

    this.setState({ callResult: result, txHash: "" });

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

    this.setState({ callResult: "", txHash: txHash });

    console.log("Call Tx: " + txHash);
  }

  async checkTx(txHash) {
    let txResult = "";

    try {
      const provider = new IconService.HttpProvider(
        this.context.explorerState.endpoint
      );
      const iconService = new IconService(provider);
      txResult = await iconService.getTransactionResult(txHash).execute();
    } catch (err) {
      txResult = err;
    }

    this.setState({
      callResult: txResult,
    });
  }

  render() {
    return (
      <div className="row my-3 ApiItem">
        <div className="container">
          <div className="row">
            <div
              type="button"
              className="btn btn-primary api-button"
              onClick={this.handleClick}
            >
              {this.state.methodName}
            </div>
          </div>

          {this.state.methodParams.length > 0
            ? this.state.methodParams.map((param, index) => (
                <div className="row my-1" key={index}>
                  <div className="col">
                    <div className="row">
                      <div className="col-auto">
                        <var>{param.name}</var> : <code>{param.type}</code>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control param-input"
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
            : ""}

          <Output
            callResult={this.state.callResult}
            txHash={this.state.txHash}
            checkTx={async () => this.checkTx(this.state.txHash)}
          />
        </div>
      </div>
    );
  }
}

function ApiList(props) {
  return props.methods.map((item, index) => (
    <ApiItem
      methodName={item.methodName}
      methodParams={item.methodParams}
      readonly={props.readonly}
      key={index + item.methodName}
    />
  ));
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
      invalidContractError: "",
    };
  }

  async componentDidMount() {
    await this.fetchMethods();
  }

  async fetchMethods() {
    try {
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
      this.setState({
        readonlyMethods: readonlyMethods,
        invalidContractError: "",
      });
    } catch (err) {
      this.setState({ invalidContractError: err });
    }

    // console.log("API list: " + JSON.stringify(apiList.getList(), null, 2));
    // console.log("API list: " + JSON.stringify(methods, null, 2));
  }

  render() {
    return (
      <div className="container-fluid ContractApi">
        <h4>{this.state.title}</h4>
        <div className="container-fluid">
          <div className="row my-4">
            <div className="col-auto">
              <span className="inline-span">Contract address</span>
            </div>

            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                id="contract-address-input"
                value={this.context.explorerState.contract}
                onChange={(e) =>
                  this.context.updateExplorerState({ contract: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    this.fetchMethods();
                  }
                }}
                title="Press Enter to refresh contract API list"
              />
            </div>
            <div className="col-auto">
              <div
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={async () => this.fetchMethods()}
              >
                Refresh
              </div>
            </div>
            <div className="col-auto">
              {this.state.invalidContractError ? (
                <div className="alert alert-warning" role="alert">
                  {this.state.invalidContractError}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="row">
            <div className="col mx-1">
              <h5 id="ApiList-title">Readonly methods</h5>
              <div className="container">
                <ApiList methods={this.state.readonlyMethods} readonly={true} />
              </div>
            </div>
            <div className="col mx-1">
              <h5 id="ApiList-title">Writable methods</h5>
              <div className="container">
                <ApiList methods={this.state.methods} readonly={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
