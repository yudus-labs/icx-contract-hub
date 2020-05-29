import React from "react";
import { UserSetting } from "./UserSetting.js";
import { ContractApi, ApiItem } from "./ContractApi.js";
import "./css/IcxExplorer.css";

const ExplorerContext = React.createContext();
UserSetting.contextType = ExplorerContext;
ApiItem.contextType = ExplorerContext;
ContractApi.contextType = ExplorerContext;

const DEFAULT_ENDPOINT = "https://bicon.tracker.solidwallet.io/api/v3";
const DEFAULT_OWNER = "hxfafe76ab475a06b184587695327e72c04b4566a4";
const DEFAULT_PKEY = "";
const DEFAULT_CONTRACT = "cxa6ba8f0730ad952b5898ac3e5e90a17e20574eff";

class IcxExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: DEFAULT_ENDPOINT,
      owner: DEFAULT_OWNER,
      pkey: "",
      contract: DEFAULT_CONTRACT,
    };
  }

  updateExplorerState = (data) => {
    this.setState(data);
  };

  render() {
    return (
      <div className="container-fluid IcxExplorer">
        <header id="IcxExplorer-header">ICX Contract Explorer</header>

        <ExplorerContext.Provider
          value={{
            explorerState: {
              endpoint: this.state.endpoint,
              owner: this.state.owner,
              pkey: this.state.pkey,
              contract: this.state.contract,
            },
            updateExplorerState: this.updateExplorerState,
          }}
        >
          <div className="container-fluid" id="IcxExplorer-body">
            <br />
            <UserSetting
              title="User setting"
              endpoint={DEFAULT_ENDPOINT}
              owner={DEFAULT_OWNER}
              pkey={DEFAULT_PKEY}
              contract={DEFAULT_CONTRACT}
            />
            <br />
            <ContractApi title="Contract APIs" />
            <br />
          </div>
        </ExplorerContext.Provider>
      </div>
    );
  }
}

export default IcxExplorer;
