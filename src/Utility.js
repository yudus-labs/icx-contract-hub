import React from "react";
import "./css/Utility.css";

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
        <h5>
          Convert <code>ICX</code> to/from <code>loops</code>
        </h5>
        <div className="row">
          <div className="col-auto">
            <input
              type="text"
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
              type="text"
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
        <h5>
          Convert <code>decimal</code> to/from <code>hex</code>
        </h5>
        <div className="row">
          <div className="col-auto">
            <input
              type="text"
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
        </div>
      </div>
    );
  }
}
