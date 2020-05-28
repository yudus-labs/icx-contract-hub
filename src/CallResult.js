import React from "react";
import "./css/CallResult.css";
import IconService from "icon-sdk-js";

export class CallResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: props.title };
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

    this.context.updateExplorerState({
      callResult: txResult,
    });
  }

  render() {
    return (
      <div className="container CallResult">
        <h4>{this.state.title}</h4>
        <div className="container">
          <div className="row">
            <div className="col-auto">
              <span className="inline-span">Transaction hash</span>
            </div>
            <div className="col">
              <textarea
                value={this.context.explorerState.callTx}
                readOnly={true}
                rows="1"
                className="form-control text-area"
              />
            </div>
            <div className="col-auto">
              <div
                type="button"
                className="btn btn-primary api-button"
                onClick={async () =>
                  this.checkTx(this.context.explorerState.callTx)
                }
              >
                Check TX result
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <h5>Call / Tx result</h5>
              <textarea
                value={JSON.stringify(
                  this.context.explorerState.callResult,
                  null,
                  2
                )}
                readOnly={true}
                rows="4"
                className="form-control text-area"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
