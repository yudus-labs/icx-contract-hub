import React from "react";
import PropTypes from "prop-types";

import "./BookmarkPanel.css";

const BOOKMARK_KEY = "CONTRACT_BOOKMARK";

export class BookmarkPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curContract: "",
      bookmark: {},
    };
  }

  componentDidMount() {
    const bookmark = this.loadBookmark();
    this.setState({ bookmark: bookmark });
  }

  loadBookmark() {
    let bookmark = localStorage.getItem(BOOKMARK_KEY);
    bookmark = bookmark ? JSON.parse(bookmark) : {};

    return bookmark;
  }

  saveBookmark(bookmark) {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));
  }

  updateBookmark(address, alias) {
    let bookmark = this.loadBookmark();
    bookmark[address] = alias;

    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));
    this.setState({ bookmark: bookmark });
  }

  ChooseContractDropdown = (props) => {
    return (
      <div className="dropdown">
        <button
          className="btn btn-primary btn-sm dropdown-toggle hub-btn-primary"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {props.curContract
            ? props.bookmark[props.curContract] + " - " + props.curContract
            : "No contract selected"}
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {Object.keys(props.bookmark).map((address, index) => (
            <button
              className="dropdown-item"
              type="button"
              onClick={() => props.handleContractChange(address)}
              key={index + address}
            >
              {props.bookmark[address]} - {address}
            </button>
          ))}
        </div>
      </div>
    );
  };

  handleContractChange = (address) => {
    this.setState({ curContract: address });
    this.props.updateHubState({ contract: address });
  };

  deleteBookmarkItem = (address) => {
    let bookmark = this.state.bookmark;
    delete bookmark[address];
    let curContract =
      address === this.state.curContract ? "" : this.state.curContract;

    curContract = curContract
      ? curContract
      : Object.keys(bookmark).length > 0
      ? Object.keys(bookmark)[0]
      : "";

    this.setState({ bookmark: bookmark, curContract: curContract });
    this.saveBookmark(bookmark);
  };

  render() {
    return (
      <div className="container-fluid bookmark-panel">
        <div className="row">
          <div className="col">
            <this.ChooseContractDropdown
              curContract={this.state.curContract}
              bookmark={this.state.bookmark}
              handleContractChange={this.handleContractChange}
            />
          </div>
        </div>
        <br />

        <div className="row">
          <div className="col-auto">
            <i>
              Bookmark record will be saved or created automatically while you
              are editing
            </i>
          </div>
        </div>
        <br />

        <div className="row align-items-center">
          <div className="col-auto">Contract address</div>
          <div className="col-4">
            <input
              type="text"
              className="form-control"
              value={this.state.curContract || ""}
              onChange={(e) => {
                e.persist();
                this.setState({
                  curContract: e.target.value,
                });
              }}
              title="Contract address"
              placeholder="Contract address, required"
            />
          </div>
          <div className="col-auto">Contract alias</div>
          <div className="col-auto">
            <input
              type="text"
              className="form-control"
              value={this.state.bookmark[this.state.curContract] || ""}
              onChange={(e) => {
                e.persist();

                if (this.state.curContract) {
                  let bookmark = this.state.bookmark;
                  bookmark[this.state.curContract] = e.target.value;

                  this.setState({
                    bookmark: bookmark,
                  });
                  this.saveBookmark(bookmark);
                }
              }}
              title="Contract alias"
              placeholder="Contract alias"
            />
          </div>

          <div className="col-auto">
            <div
              type="button"
              className="btn btn-primary btn-sm hub-btn-primary"
              onClick={() => {
                this.deleteBookmarkItem(this.state.curContract);
              }}
            >
              Delete from bookmark
            </div>
          </div>
        </div>
      </div>
    );
  }
}
BookmarkPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
