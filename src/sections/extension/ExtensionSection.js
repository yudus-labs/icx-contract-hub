import React from "react";
import { TabView } from "../../common/TabView";

import "../../css/ExtensionSection.css";

class AuthenticationPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid authentication-panel">
        Auth Panel content
      </div>
    );
  }
}

class UtilityPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid utility-panel">Utility Panel content</div>
    );
  }
}

class BookmarkPanel extends React.Component {
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

export class ExtensionSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid extension-section">
        <TabView
          tabModules={{
            titles: ["Authentication", "Utilities", "Bookmarks"],
            panels: [
              <AuthenticationPanel />,
              <UtilityPanel />,
              <BookmarkPanel />,
            ],
          }}
        />
      </div>
    );
  }
}
