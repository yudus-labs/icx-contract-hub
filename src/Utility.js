import React from "react";
import "./css/Utility.css";
import IconService, { HttpProvider } from "icon-sdk-js";

export class CheckTx extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txHash: "",
      txResult: "",
    };
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
      txResult: txResult,
    });
  }

  render() {
    return (
      <div className="container IcxLoopConverter">
        <h6 className="utility-label">Check transaction result</h6>

        <div className="row my-1">
          <div className="col-auto">
            <div
              type="button"
              className="btn btn-primary btn-sm"
              onClick={async () => this.checkTx(this.state.txHash)}
            >
              Check result of TX hash ->
            </div>
          </div>

          <div className="col">
            <input
              type="text"
              className="form-control"
              value={this.state.txHash}
              onChange={(e) => {
                this.setState({ txHash: e.target.value });
              }}
              onKeyPress={async (e) => {
                if (e.key === "Enter") {
                  this.checkTx(e.target.value);
                }
              }}
              title="Press Enter to check"
              required={true}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <textarea
              value={JSON.stringify(this.state.txResult, null, 2)}
              readOnly={true}
              className="form-control text-area"
            />
          </div>
        </div>
      </div>
    );
  }
}

class IcxLoopConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      loops: 0,
      icx: 0,
    };
  }

  icxToLoop = (value) => {
    this.setState({ loops: parseFloat(value) * 10 ** 18 });
  };

  loopToIcx = (value) => {
    this.setState({ icx: parseInt(value) / 10 ** 18 });
  };

  render() {
    return (
      <div className="container IcxLoopConverter">
        <h6 className="utility-label">
          Convert <code>ICX</code> to/from <code>loops</code>
        </h6>
        <div className="row">
          <div className="col-auto">
            <input
              type="number"
              className="form-control"
              value={this.state.icx}
              onChange={(e) => this.setState({ icx: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  this.icxToLoop(e.target.value);
                }
              }}
              title="Press Enter to convert"
            />
          </div>
          <div className="col-auto">
            <div className="span12 text-center">ICX</div>
          </div>
          <div className="col-auto">{"<==>"}</div>
          <div className="col-auto">
            <input
              type="number"
              className="form-control"
              value={this.state.loops}
              onChange={(e) => this.setState({ loops: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  this.loopToIcx(e.target.value);
                }
              }}
              title="Press Enter to convert"
            />
          </div>

          <div className="col-auto">
            <div className="span12 text-center">loops</div>
          </div>
        </div>
      </div>
    );
  }
}

class HexConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      hex: 0,
      dec: 0,
    };
  }

  decToHex = (value) => {
    this.setState({ hex: parseInt(value).toString(16) });
  };

  hexToDec = (value) => {
    this.setState({ dec: parseInt(value, 16) });
  };

  render() {
    return (
      <div className="container IcxLoopConverter">
        <h6 className="utility-label">
          Convert <code>decimal</code> to/from <code>hex</code>
        </h6>
        <div className="row">
          <div className="col-auto">
            <input
              type="number"
              className="form-control"
              value={this.state.dec}
              onChange={(e) => this.setState({ dec: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  this.decToHex(e.target.value);
                }
              }}
              title="Press Enter to convert"
            />
          </div>
          <div className="col-auto">
            <div className="span12 text-center">decimal</div>
          </div>
          <div className="col-auto">{"<==>"}</div>
          <div className="col-auto">
            <input
              type="text"
              className="form-control"
              value={this.state.hex}
              onChange={(e) => this.setState({ hex: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  this.hexToDec(e.target.value);
                }
              }}
              title="Press Enter to convert"
            />
          </div>

          <div className="col-auto">
            <div className="span12 text-center">hex</div>
          </div>
        </div>
      </div>
    );
  }
}

export class Utility extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
    };
  }

  render() {
    return (
      <div className="container Utility">
        <h4 id="Utility-title">{this.state.title}</h4>
        <div className="container">
          <div className="row">
            <IcxLoopConverter />
          </div>
          <br />
          <div className="row">
            <HexConverter />
          </div>
          <br />
          <div className="row">
            <CheckTx />
          </div>
        </div>
      </div>
    );
  }
}
