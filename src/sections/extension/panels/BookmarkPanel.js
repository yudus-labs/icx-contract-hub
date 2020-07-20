import React from "react";
import PropTypes from "prop-types";

import "./BookmarkPanel.css";

export class BookmarkPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid bookmark-panel">
        Bookmark Panel content
      </div>
    );
  }
}
BookmarkPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
