import React from "react";
import PropTypes from "prop-types";
import { IconApi } from "../../../chainApi/IconApi.js";

import "./UtilityPanel.css";

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
      const api = new IconApi({
        endpoint: this.props.hubState.network.loopchain_endpoint,
        nid: this.props.hubState.network.network_id,
        contract: this.props.hubState.contract,
      });
      txResult = await api.checkTx(txHash);
    } catch (err) {
      txResult = err;
    }

    this.setState({
      txResult: txResult,
    });
  }

  render() {
    return (
      <div className="container-fluid unit-converter">
        <h6 className="utility-label">Check transaction result</h6>

        <div className="row my-1">
          <div className="col-auto">
            <div
              type="button"
              className="btn btn-primary btn-sm hub-btn-primary"
              onClick={async () => this.checkTx(this.state.txHash)}
            >
              Check
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
              placeholder="Tx hash here"
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
CheckTx.propTypes = {
  hubState: PropTypes.object,
};

class UnitConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loops: 0,
      icx: 0,
      hex: 0,
      dec: 0,
    };
  }

  icxToLoop = (value) => {
    this.setState({ loops: parseFloat(value) * 10 ** 18 });
  };

  loopToIcx = (value) => {
    this.setState({ icx: parseInt(value) / 10 ** 18 });
  };

  decToHex = (value) => {
    this.setState({ hex: parseInt(value).toString(16) });
  };

  hexToDec = (value) => {
    this.setState({ dec: parseInt(value, 16) });
  };

  render() {
    return (
      <div className="container-fluid unit-converter">
        <h6 className="utility-label">Unit convert</h6>
        <div className="row my-1">
          <div className="col">
            <input
              type="number"
              className="form-control"
              value={this.state.icx}
              onChange={(e) => {
                this.setState({ icx: e.target.value });
                this.icxToLoop(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  this.icxToLoop(e.target.value);
                }
              }}
              title="Input ICX here and press Enter"
            />
          </div>

          <div className="col-auto">
            <code>ICX</code> to/from <code>loops</code>
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              value={this.state.loops}
              onChange={(e) => {
                this.setState({ loops: e.target.value });
                this.loopToIcx(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  this.loopToIcx(e.target.value);
                }
              }}
              title="Input loops here and press Enter"
            />
          </div>
        </div>

        <div className="row my-2">
          <div className="col">
            <input
              type="number"
              className="form-control"
              value={this.state.dec}
              onChange={(e) => {
                this.setState({ dec: e.target.value });
                this.decToHex(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  this.decToHex(e.target.value);
                }
              }}
              title="Input decimal here and press Enter"
            />
          </div>

          <div className="col-auto">
            <code>decimal</code> to/from <code>hex</code>
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              value={this.state.hex}
              onChange={(e) => {
                this.setState({ hex: e.target.value });
                this.hexToDec(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  this.hexToDec(e.target.value);
                }
              }}
              title="Input hex here and press Enter"
            />
          </div>
        </div>
      </div>
    );
  }
}

export function UtilityPanel(props) {
  return (
    <div className="container-fluid utility-panel">
      <div className="row">
        <div className="col">
          <UnitConverter />
        </div>
        <div className="col">
          <CheckTx hubState={props.hubState} />
        </div>
      </div>
    </div>
  );
}

UtilityPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
