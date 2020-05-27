import React from "react";
import { UserSetting } from "./UserSetting.js";
import { ContractApi, ApiItem } from "./ContractApi.js";
import { CallResult } from "./CallResult.js";
import "./css/IcxExplorer.css";

const ExplorerContext = React.createContext();
UserSetting.contextType = ExplorerContext;
ApiItem.contextType = ExplorerContext;
CallResult.contextType = ExplorerContext;

const DEFAULT_ENDPOINT = "https://bicon.tracker.solidwallet.io";
const DEFAULT_PKEY = "Please input private key here";
const DEFAULT_CONTRACT = "cxa6ba8f0730ad952b5898ac3e5e90a17e20574eff";

class IcxExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callResult: "Empty call result",
      lastCall: "",
      endpoint: "",
      pkey: "",
      contract: "",
    };
  }

  updateExplorerState = (data) => {
    this.setState(data);
  };

  render() {
    return (
      <div className="container IcxExplorer">
        <header id="IcxExplorer-header">ICX Contract Explorer</header>

        <ExplorerContext.Provider
          value={{
            explorerState: { callResult: this.state.callResult },
            updateExplorerState: this.updateExplorerState,
          }}
        >
          <div className="container" id="IcxExplorer-body">
            <br />
            <UserSetting
              title="User setting"
              endpoint={DEFAULT_ENDPOINT}
              pkey={DEFAULT_PKEY}
              contract={DEFAULT_CONTRACT}
            />
            <br />
            <ContractApi title="Contract APIs" />
            <br />
            <CallResult title="Contract call result" />
            <br />
          </div>
        </ExplorerContext.Provider>
      </div>
    );
  }
}

export default IcxExplorer;
