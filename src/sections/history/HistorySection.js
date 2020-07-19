import React from "react";
import { TabView } from "../../common/TabView";

import "../../css/sections/HistorySection.css";

class TransactionPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid transaction-panel">
        Transaction Panel content
      </div>
    );
  }
}

class InternalTransactionPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid internal-transaction-panel">
        Internal Transaction Panel content
      </div>
    );
  }
}

export class HistorySection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid history-section">
        <TabView
          tabModules={{
            titles: ["Transactions", "Internal Transactions"],
            panels: [<TransactionPanel />, <InternalTransactionPanel />],
          }}
        />
      </div>
    );
  }
}
