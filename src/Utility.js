import React from "react";
import "./css/Utility.css";

class IcxConverter extends React.Component {
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
      <div className="container IcxConverter">
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
        <h4>{this.state.title}</h4>
        <div className="container">
          <div className="row">
            <IcxConverter />
          </div>
        </div>
      </div>
    );
  }
}
