import React from "react";
import { TabView } from "../../common/TabView";

import "../css/CallSection.css";

class CallSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid CallSection">
        <TabView />
      </div>
    );
  }
}

export default CallSection;
