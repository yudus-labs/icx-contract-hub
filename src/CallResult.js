import React from "react";
import "./css/CallResult.css";

export class CallResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: props.title };
  }

  render() {
    console.log("Call result: " + this.context.explorerState.callResult);
    return (
      <div className="container CallResult">
        <h4>{this.state.title}</h4>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <textarea
                value={this.context.explorerState.callResult}
                readOnly={true}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
