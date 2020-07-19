import React from "react";

import { HorizonalSeparator } from "../../common/Util";
import "./HeaderSection.css";

const TITLE = "ICX Contract Hub";
const SUB_TITLE = "For ICON developers - By Yudus Lab";
const COPYRIGHT = "v0.3.0 - © 2020";

function TitlePanel(props) {
  return (
    <div className="col title-panel">
      <div id="main-title">{TITLE}</div>
      <HorizonalSeparator width={"320px"} />
      <div id="sub-title">{SUB_TITLE}</div>
      <div id="copyright">{COPYRIGHT}</div>
    </div>
  );
}

export class HeaderSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid section-block header-section">
        <div className="container-fluid">
          <div className="row">
            <TitlePanel />
          </div>
        </div>
      </div>
    );
  }
}
