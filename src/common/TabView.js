import React from "react";

import "../css/TabView.css";

class TabViewHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabButtons: props.tabButtons,
    };
  }

  render() {
    return (
      <div className="container-fluid tab-view-header">
        <div className="row">{this.state.tabButtons}</div>
      </div>
    );
  }
}

class TabViewBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid tab-view-body">
        {this.props.currentTab}
      </div>
    );
  }
}

export class TabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabModules: props.tabModules,
      currentTabId: 0,
    };
  }

  handleTitleClick = (tabId) => {
    // console.log(tabId);
    this.setState({
      currentTabId: this.state.currentTabId !== tabId ? tabId : -1,
    });
  };

  render() {
    return (
      <div className="container-fluid tab-view">
        <TabViewHeader
          tabButtons={this.state.tabModules.titles.map((title, index) => (
            <div
              type="button"
              className="btn btn-primary tab-view-header-title"
              onClick={(e) => {
                this.handleTitleClick(index);
              }}
              key={index}
            >
              {title}
            </div>
          ))}
        />
        <TabViewBody
          currentTab={
            this.state.currentTabId !== -1
              ? this.state.tabModules.panels[this.state.currentTabId]
              : ""
          }
        />
      </div>
    );
  }
}
