import React from "react";
import { HorizonalSeparator, VerticalSeparator } from "./Util";

import "../css/TabView.css";

function TabViewHeaderTitle(props) {
  return (
    <button
      type="button"
      className={
        props.active
          ? "btn btn-primary tab-view-header-title-active"
          : "btn btn-primary tab-view-header-title-inactive"
      }
      onClick={(e) => {
        props.handleTitleClick(props.index);
      }}
    >
      {props.title}
    </button>
  );
}

function TabViewHeader(props) {
  return (
    <div className="container-fluid tab-view-header">
      <div className="row">
        {props.tabTitles.map((title, index) => [
          <TabViewHeaderTitle
            title={title}
            index={index}
            active={index === props.currentTabId}
            handleTitleClick={props.handleTitleClick}
            key={index}
          />,
          index + 1 < props.tabTitles.length ? <VerticalSeparator /> : "",
        ])}
      </div>
    </div>
  );
}

function TabViewBody(props) {
  return (
    <div className="container-fluid tab-view-body">{props.currentTab}</div>
  );
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
          tabTitles={this.state.tabModules.titles}
          currentTabId={this.state.currentTabId}
          handleTitleClick={this.handleTitleClick}
        />
        <HorizonalSeparator />
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
