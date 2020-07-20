import React from "react";
import PropTypes from "prop-types";
import { HorizonalSeparator, VerticalSeparator } from "./Util";

import "./TabView.css";

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
          index + 1 < props.tabTitles.length ? (
            <VerticalSeparator key={index + "separator"} />
          ) : (
            ""
          ),
        ])}
      </div>
    </div>
  );
}

function EmptyTabViewPanel(props) {
  return "";
}

function TabViewBody(props) {
  const ContentPanel =
    props.currentTabId !== -1
      ? props.panelTypes[props.currentTabId]
      : EmptyTabViewPanel;
  return (
    <div className="container-fluid tab-view-body">
      {
        <ContentPanel
          hubState={props.hubState}
          updateHubState={props.updateHubState}
        />
      }
    </div>
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
          currentTabId={this.state.currentTabId}
          panelTypes={this.state.tabModules.panelTypes}
          hubState={this.props.hubState}
          updateHubState={this.props.updateHubState}
        />
      </div>
    );
  }
}

TabViewHeaderTitle.propTypes = {
  title: PropTypes.string,
  active: PropTypes.bool,
  index: PropTypes.number,
  handleTitleClick: PropTypes.func,
};

TabViewHeader.propTypes = {
  tabTitles: PropTypes.array,
  currentTabId: PropTypes.number,
  handleTitleClick: PropTypes.func,
};

TabViewBody.propTypes = {
  currentTabId: PropTypes.number,
  panelTypes: PropTypes.arrayOf(PropTypes.elementType),
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};

TabView.propTypes = {
  tabModules: PropTypes.shape({
    titles: PropTypes.array,
    panelTypes: PropTypes.arrayOf(PropTypes.elementType),
  }),
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
