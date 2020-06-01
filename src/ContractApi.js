import React from "react";
import "./css/ContractApi.css";
import IconService, {
  HttpProvider,
  IconBuilder,
  IconConverter,
  IconWallet,
  SignedTransaction,
} from "icon-sdk-js";

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
            <h6>{props.txHash ? "Transaction result" : "Call result"}</h6>
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
      const provider = new HttpProvider(this.context.explorerState.endpoint);
      const iconService = new IconService(provider);
      const call = new IconBuilder.CallBuilder()
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
      const provider = new HttpProvider(this.context.explorerState.endpoint);
      const iconService = new IconService(provider);

      const wallet = IconWallet.loadPrivateKey(this.context.explorerState.pkey);

      const transaction = new IconBuilder.CallTransactionBuilder()
        .from(wallet.getAddress())
        .to(this.context.explorerState.contract)
        .stepLimit(IconConverter.toBigNumber("5000000000"))
        .nid(IconConverter.toBigNumber("3"))
        .nonce(IconConverter.toBigNumber("1"))
        .version(IconConverter.toBigNumber("3"))
        .timestamp(new Date().getTime() * 1000)
        .method(method)
        .params(params)
        .build();

      const signedTx = new SignedTransaction(transaction, wallet);

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
      const provider = new HttpProvider(this.context.explorerState.endpoint);
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
                          required={true}
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
      contractName: "",
      noContract: true,
    };
  }

  async componentDidMount() {
    if (this.context.explorerState.contract) {
      await this.fetchMethods();
    }
  }

  async fetchMethods() {
    try {
      const provider = new HttpProvider(this.context.explorerState.endpoint);
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

      // Get contract name, if any
      try {
        const call = new IconBuilder.CallBuilder()
          .to(this.context.explorerState.contract)
          .method("name")
          .params({})
          .build();
        const cxName = await iconService.call(call).execute();
        this.setState({ contractName: cxName });
      } catch (err) {
        console.log("Failed to get contract name: " + err);
        this.setState({ contractName: "" });
      }

      // Loaded contract
      this.setState({ noContract: false });
      // Finished
    } catch (err) {
      this.setState({ invalidContractError: err });
    }

    // console.log("API list: " + JSON.stringify(apiList.getList(), null, 2));
    // console.log("API list: " + JSON.stringify(methods, null, 2));
  }

  render() {
    return (
      <div className="container-fluid ContractApi">
        <h4 id="ContractApi-title">{this.state.title}</h4>
        <div className="container-fluid">
          <div className="row my-4">
            <div className="col-auto">
              {!this.state.noContract ? (
                this.state.contractName ? (
                  <div className="contract-name">
                    Contract name : <b>{this.state.contractName}</b>
                  </div>
                ) : (
                  <div className="no-contract-name">
                    This contract has no name
                  </div>
                )
              ) : (
                <div className="no-contract-name">No contract</div>
              )}
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
                placeholder="Contract address here"
                required
              />

              {this.state.invalidContractError ? (
                <div className="alert alert-error" role="alert">
                  {this.state.invalidContractError}
                </div>
              ) : (
                ""
              )}
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
