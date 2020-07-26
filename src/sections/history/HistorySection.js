import React from "react";
import { TabView } from "../../common/TabView";

import "./HistorySection.css";

import { TransactionPanel } from "./panels/TransactionPanel";
import { InternalTransactionPanel } from "./panels/InternalTransactionPanel";

export class HistorySection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid section-block history-section">
        <TabView
          tabModules={{
            titles: ["Transactions", "Internal Transactions"],
            panelTypes: [TransactionPanel, InternalTransactionPanel],
          }}
          hubState={this.context.hubState}
          updateHubState={this.context.updateHubState}
        />
      </div>
    );
  }
}
