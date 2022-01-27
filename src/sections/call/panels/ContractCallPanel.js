import React from "react";
import PropTypes from "prop-types";

import { HorizonalSeparator, VerticalSeparator } from "../../../common/Util";
import { IconApi } from "../../../chainApi/IconApi.js";

import "./ContractCallPanel.css";

// ================================================================================================
// Output component

function TxResultTitle(props) {
  if (props.checkFailed) {
    var title = "Failed to check Tx result";
    var cssClass = "error-result-title";
  } else {
    title = "Tx failed";
    cssClass = "error-result-title";
    if (typeof props.result === "object" && props.result !== null) {
      if (props.result.hasOwnProperty("status")) {
        if (props.result["status"]) {
          title = "Tx succeed";
          cssClass = "succeed-result-title";
        }
      }
    }
  }
  return (
    <div className="row">
      <div className="col-auto">
        <h6 className={cssClass}>{title}</h6>
      </div>
    </div>
  );
}
TxResultTitle.propTypes = {
  checkFailed: PropTypes.bool,
  result: PropTypes.object,
};

function TxTitle(props) {
  const cssClass = props.txError
    ? "error-result-title"
    : "succeed-result-title";
  return (
    <h6 className={cssClass}>
      {props.txError ? "Failed to send Tx" : "Tx hash below"}
    </h6>
  );
}
TxTitle.propTypes = {
  txError: PropTypes.bool,
};

function CallResultTitle(props) {
  const cssClass = props.failed ? "error-result-title" : "succeed-result-title";
  return (
    <div className="row">
      <div className="col-auto">
        <h6 className={cssClass}>
          {props.failed ? "Call error" : "Call succeed"}
        </h6>
      </div>
    </div>
  );
}
CallResultTitle.propTypes = {
  failed: PropTypes.bool,
};

function Output(props) {
  return (
    <div className="container">
      {props.txHash ? (
        <div className="row">
          <div className="col">
            <br />
            <div className="row">
              <div className="col-auto">
                <TxTitle txError={props.txError} />
              </div>
              <div className="col-auto">
                <div
                  type="button"
                  className="btn btn-secondary btn-sm hub-btn-secondary"
                  onClick={props.checkTx}
                >
                  Check Tx
                </div>
              </div>
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
            <CallResultTitle failed={props.callFailed} />
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

      {props.txResult ? (
        <div className="row">
          <div className="col">
            {props.txHash ? "" : <br />}
            <TxResultTitle
              checkFailed={props.txCheckFailed}
              result={props.txResult}
            />
            <textarea
              value={JSON.stringify(props.txResult, null, 2)}
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
Output.propTypes = {
  txHash: PropTypes.string,
  txError: PropTypes.bool,
  checkTx: PropTypes.func,

  callResult: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  callFailed: PropTypes.bool,
  txResult: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  txCheckFailed: PropTypes.bool,
};

// ================================================================================================
// ApiList and ApiItem

export class ApiItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      icxValue: "",

      methodName: props.methodName,
      methodParams: props.methodParams,
      payable: props.payable,
      readonly: props.readonly,
      paramValues: {},

      fetching: false,

      txHash: "",
      txError: false,
      txCheckFailed: false,
      txResult: "",

      callResult: "",
      callFailed: false,
    };
  }

  handleClick = async () => {
    this.setState({ fetching: true });

    if (this.state.readonly) {
      this.call(this.state.methodName, this.state.paramValues);
    } else {
      this.sendCallTx(
        this.state.methodName,
        this.state.paramValues,
        parseFloat(this.state.icxValue) * 10 ** 18
      );
    }
  };

  updateParamValue = (param, value) => {
    this.setState((state) => {
      const paramValues = state.paramValues;
      paramValues[param] = value;
      return { paramValues: paramValues };
    });
  };

  async call(method, params) {
    console.log(`Calling method: ${method}`);
    console.log(`..with params: ${JSON.stringify(params)}`);

    let result = "";
    let failed;

    try {
      const api = new IconApi(
        {
          endpoint: this.props.hubState.network.loopchain_endpoint,
          nid: this.props.hubState.network.network_id,
          contract: this.props.hubState.contract,
        },
        {},
        this.props.stepLimit
      );
      result = await api.call(method, params);
      failed = false;
    } catch (err) {
      result = err;
      failed = true;
    }

    this.setState({
      callResult: result || "Undefined",
      callFailed: failed,
      txHash: "",
      fetching: false,
    });

    console.log("Call result: " + result);
  }

  async sendCallTx(method, params, value) {
    console.log(`Calling method: ${method}`);
    console.log(`..with params: ${JSON.stringify(params)}`);
    console.log(`..and ICX value: ${value}`);

    let txHash = "";
    let failed;

    try {
      const api = new IconApi(
        {
          endpoint: this.props.hubState.network.loopchain_endpoint,
          nid: this.props.hubState.network.network_id,
          contract: this.props.hubState.contract,
        },
        {
          pkey: this.props.hubState.auth.pkey,
          keystore: this.props.hubState.auth.keystore,
          keystorePass: this.props.hubState.auth.keystorePass,
          iconexWallet: this.props.hubState.auth.iconexWallet,
        },
        this.props.stepLimit
      );

      txHash = await api.sendCallTx(method, params, value);
      failed = false;
    } catch (err) {
      txHash = err;
      failed = true;
    }

    this.setState({
      callResult: "",
      txHash: txHash,
      txError: failed,
      fetching: false,
    });

    console.log("Call Tx: " + txHash);
  }

  async checkTx(txHash) {
    let txResult = "";
    let failed = false;

    try {
      const api = new IconApi(
        {
          endpoint: this.props.hubState.network.loopchain_endpoint,
          nid: this.props.hubState.network.network_id,
          contract: this.props.hubState.contract,
        },
        {},
        this.props.stepLimit
      );
      txResult = await api.checkTx(txHash);
      failed = false;
    } catch (err) {
      txResult = err;
      failed = true;
    }

    this.setState({
      txResult: txResult,
      txCheckFailed: failed,
    });
  }

  render() {
    return (
      <div className="row my-3 api-item">
        <div className="container">
          <div className="row">
            <div
              type="button"
              className="btn btn-primary hub-btn-primary api-button"
              onClick={this.handleClick}
            >
              {this.state.methodName}
            </div>

            {!this.state.readonly && this.state.payable ? (
              <div>
                <input
                  type="number"
                  className="form-control icx-amount-input"
                  value={this.state.icxValue || ""}
                  onChange={(e) => this.setState({ icxValue: e.target.value })}
                  placeholder="Payable value in ICX"
                  title="ICX value to be sent with payable contract call, in ICX unit"
                />
              </div>
            ) : (
              ""
            )}

            {this.state.fetching ? (
              <div className="fetching">Calling...</div>
            ) : (
              ""
            )}
          </div>

          {/* Params list */}
          {this.state.methodParams.length > 0
            ? this.state.methodParams.map((param, index) => (
                <div className="row my-2" key={index}>
                  <div className="col">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <var className="param-name">{param.name}</var> :{" "}
                        <code>{param.type}</code>
                      </div>
                      <div className="col">
                        {param.type === "struct" ? console.log(this.state.methodParams) ||
                          param.fields?.map((field, index) => (
                            <div className="col">
                              <div className="col-auto">
                                <var className="param-name">{field.name}</var> :{" "}
                                <code>{field.type}</code>
                              </div>
                              <input
                                type="text"
                                className="form-control param-input"
                                value={this.state.paramValues[param.name] ? this.state.paramValues[param.name][field.name] : "" || ""}
                                onChange={(e) => {
                                  var fields = this.state.paramValues[param.name] || {}
                                  fields[field.name] = e.target.value
                                  this.updateParamValue(param.name, fields)
                                }}
                                required={true}
                              />
                            </div>
                          )) :
                            <input
                              type="text"
                              className="form-control param-input"
                              value={this.state.paramValues[param.name] || ""}
                              onChange={(e) =>
                                this.updateParamValue(param.name, e.target.value)
                              }
                              required={true}
                            />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : ""}

          <Output
            callFailed={this.state.callFailed}
            callResult={this.state.callResult}
            txHash={this.state.txHash}
            txError={this.state.txError}
            txCheckFailed={this.state.txCheckFailed}
            txResult={this.state.txResult}
            checkTx={async () => this.checkTx(this.state.txHash)}
          />
        </div>
      </div>
    );
  }
}
ApiItem.propTypes = {
  methodName: PropTypes.string,
  methodParams: PropTypes.array,
  payable: PropTypes.bool,
  readonly: PropTypes.bool,

  hubState: PropTypes.object,
  stepLimit: PropTypes.string,
};

function ApiList(props) {
  return (
    <div className="container api-list">
      {props.methods.map((item, index) => (
        <ApiItem
          methodName={item.methodName}
          methodParams={item.methodParams}
          payable={item.payable}
          readonly={props.readonly}
          hubState={props.hubState}
          stepLimit={props.stepLimit}
          key={index + item.methodName}
        />
      ))}
    </div>
  );
}
ApiList.propTypes = {
  methods: PropTypes.array,
  readonly: PropTypes.bool,
  hubState: PropTypes.object,
  stepLimit: PropTypes.string,
};

// ================================================================================================
// ContractCallPanel

/**
 * Contain list of SCORE contract calls and their params input
 */
export class ContractCallPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readonlyMethods: [],
      methods: [],
      invalidContractError: "",
      contractName: "",
      noContract: true,
      fetching: false,
      stepLimit: "500000000",
    };
  }

  async componentDidMount() {
    if (this.props.hubState.contract) {
      await this.fetchMethods();
    }
  }

  async fetchMethods() {
    this.setState({ fetching: true });

    try {
      const api = new IconApi({
        endpoint: this.props.hubState.network.loopchain_endpoint,
        nid: this.props.hubState.network.network_id,
        contract: this.props.hubState.contract,
      });
      const apiList = await api.getScoreApi();

      const methods = apiList
        .getList()
        .filter((item) => item.type === "function")
        .filter((item) => !item.hasOwnProperty("readonly"))
        .map((item) => ({
          methodName: item.name,
          methodParams: item.inputs,
          payable: item.hasOwnProperty("payable"),
        }));
      this.setState({ methods: methods });

      const readonlyMethods = apiList
        .getList()
        .filter((item) => item.type === "function")
        .filter((item) => item.hasOwnProperty("readonly"))
        .map((item) => ({
          methodName: item.name,
          methodParams: item.inputs,
          payable: false,
        }));
      this.setState({
        readonlyMethods: readonlyMethods,
      });

      // Reset error message if any
      this.setState({
        invalidContractError: "",
      });

      // Get contract name, if any
      try {
        const api = new IconApi({
          endpoint: this.props.hubState.network.loopchain_endpoint,
          nid: this.props.hubState.network.network_id,
          contract: this.props.hubState.contract,
        });
        const cxName = await api.call("name", {});
        this.setState({ contractName: cxName });
      } catch (err) {
        console.log("Failed to get contract name: " + err);
        this.setState({ contractName: "" });
      }

      // Loaded contract
      this.setState({ noContract: false });
      // Finished

      // console.log("API list: " + JSON.stringify(apiList.getList(), null, 2));
      // console.log("API list: " + JSON.stringify(methods, null, 2));
    } catch (err) {
      this.setState({ invalidContractError: err });
    }

    this.setState({ fetching: false });
  }

  render() {
    return (
      <div className="container-fluid contract-call-panel">
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
              value={this.props.hubState.contract}
              onChange={(e) =>
                this.props.updateHubState({ contract: e.target.value })
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
              className="btn btn-primary btn-sm hub-btn-primary"
              onClick={async () => this.fetchMethods()}
            >
              Refresh
            </div>
          </div>

          {this.state.fetching ? (
            <div className="fetching">Fetching contract APIs...</div>
          ) : (
            ""
          )}

          <VerticalSeparator />

          <div className="col-auto align-self-center">Step limit</div>

          <div className="col-auto">
            <input
              type="text"
              className="form-control"
              id="step-limit-input"
              value={this.state.stepLimit}
              onChange={(e) => this.setState({ stepLimit: e.target.value })}
              title="Step limit"
              placeholder="Step limit"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <h5 className="api-list-title">Readonly</h5>
            <HorizonalSeparator />

            <ApiList
              methods={this.state.readonlyMethods}
              readonly={true}
              hubState={this.props.hubState}
              stepLimit={this.state.stepLimit}
            />

            {this.state.readonlyMethods.length > 0 ? "" : "...empty..."}
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <h5 id="api-list-title">Writable</h5>
            <HorizonalSeparator />

            <ApiList
              methods={this.state.methods}
              readonly={false}
              hubState={this.props.hubState}
              stepLimit={this.state.stepLimit}
            />

            {this.state.methods.length > 0 ? "" : "...empty..."}
          </div>
        </div>
      </div>
    );
  }
}
ContractCallPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
