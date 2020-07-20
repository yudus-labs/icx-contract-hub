import React from "react";

import { TabView } from "../../common/TabView";
import { AuthenticationPanel } from "./panels/AuthenticationPanel";
import { UtilityPanel } from "./panels/UtilityPanel";
import { BookmarkPanel } from "./panels/BookmarkPanel";
import { WalletSwarmPanel } from "./panels/WalletSwarmPanel";
import { ContractStatsPanel } from "./panels/ContractStatsPanel";

import "./ExtensionSection.css";

export class ExtensionSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid section-block extension-section">
        <TabView
          tabModules={{
            titles: [
              "Authentication",
              "Utilities",
              "Bookmarks",
              "Wallet Swarm",
              "Contract Stats",
            ],
            panelTypes: [
              AuthenticationPanel,
              UtilityPanel,
              BookmarkPanel,
              WalletSwarmPanel,
              ContractStatsPanel,
            ],
          }}
          hubState={this.context.hubState}
          updateHubState={this.context.updateHubState}
        />
      </div>
    );
  }
}
