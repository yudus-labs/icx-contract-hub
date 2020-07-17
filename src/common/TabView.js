import React from "react";

import "../css/TabView.css";

class TabItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabTitle: props.tabTitle,
    };
  }

  render() {
    return <div className="container-fluid TabItem">Tab Content</div>;
  }
}

class TabViewHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabButtons: props.tabButtons,
    };
  }

  render() {
    return (
      <div className="container-fluid TabViewHeader">
        {this.tate.tabButtons}
      </div>
    );
  }
}

class TabViewBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: props.currentTab,
    };
  }

  render() {
    return (
      <div className="container-fluid TabViewBody">{this.state.currentTab}</div>
    );
  }
}

class TabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabItems: props.tabItems,
      currentTabId: 0,
    };
  }

  render() {
    return (
      <div className="container-fluid TabView">
        <TabViewHeader tabButtons={{}} />
        <TabViewBody
          currentTab={this.state.tabItems[this.state.currentTabId]}
        />
      </div>
    );
  }
}

export default TabView;
