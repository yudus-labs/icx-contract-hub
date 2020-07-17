import React from "react";
import { TabView } from "../../common/TabView";

import "../css/HistorySection.css";

class HistorySection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid HistorySection">
        <TabView />
      </div>
    );
  }
}

export default HistorySection;
