import React from "react";
import { TabView } from "../../common/TabView";

import "./CallSection.css";

class ContractCallPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid contract-call-panel">
        Contract Calls Panel content
      </div>
    );
  }
}

export class CallSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid section-block call-section">
        <TabView
          tabModules={{
            titles: ["Contract Calls"],
            panelTypes: [ContractCallPanel],
          }}
          hubState={this.context.hubState}
          updateHubState={this.context.updateHubState}
        />
      </div>
    );
  }
}
