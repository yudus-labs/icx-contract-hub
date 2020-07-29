import React from "react";
import PropTypes from "prop-types";
import { VerticalSeparator } from "./Util";

import "./TableView.css";

// ================================================================================================
// Cells

export function HashCell(props) {
  return (
    <div className="row justify-content-center hash-cell">
      {props.cellValue.slice(0, 8)}..
      {props.cellValue.slice(
        props.cellValue.length - 6,
        props.cellValue.length
      )}
    </div>
  );
}
HashCell.propTypes = {
  cellValue: PropTypes.any,
  hubState: PropTypes.object,
};

export function BlockCell(props) {
  return (
    <div className="row justify-content-center block-cell">
      {props.cellValue.toLocaleString()}
    </div>
  );
}
BlockCell.propTypes = {
  cellValue: PropTypes.any,
  hubState: PropTypes.object,
};

export function AgeCell(props) {
  const d = new Date(parseInt(props.cellValue / 1000));
  return (
    <div className="row justify-content-center age-cell">
      {`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`}
    </div>
  );
}
AgeCell.propTypes = {
  cellValue: PropTypes.any,
  hubState: PropTypes.object,
};

export function AddressCell(props) {
  return (
    <div className="row justify-content-center address-cell">
      {props.cellValue.slice(0, 8)}..
      {props.cellValue.slice(
        props.cellValue.length - 6,
        props.cellValue.length
      )}
    </div>
  );
}
AddressCell.propTypes = {
  cellValue: PropTypes.any,
  hubState: PropTypes.object,
};

export function AmountCell(props) {
  return (
    <div className="row justify-content-center amount-cell">
      {props.cellValue ? props.cellValue.toFixed(4) : 0} ICX
    </div>
  );
}
AmountCell.propTypes = {
  cellValue: PropTypes.any,
  hubState: PropTypes.object,
};

export function FeeCell(props) {
  return (
    <div className="row justify-content-center fee-cell">
      {props.cellValue.toFixed(4)} ICX
    </div>
  );
}
FeeCell.propTypes = {
  cellValue: PropTypes.any,
  hubState: PropTypes.object,
};

export function CheckTxCell(props) {
  return (
    <div className="row justify-content-center check-tx-cell">
      <div
        className="btn btn-primary btn-sm hub-btn-primary check-tx-button"
        onClick={async () => props.callback(props.cellValue)}
      >
        ►
      </div>
    </div>
  );
}
CheckTxCell.propTypes = {
  cellValue: PropTypes.any,
  hubState: PropTypes.object,
  callback: PropTypes.func,
};

// ================================================================================================
// Column and TableView

function Column(props) {
  const Cell = props.colInfo.cellType;
  return (
    <div className="col-auto">
      {[
        <div
          className="row justify-content-center column-title"
          key="column-title"
        >
          {props.colInfo.title}
        </div>,
        props.rows.map((row, index) => (
          <Cell
            cellValue={props.colInfo.rowKey ? row[props.colInfo.rowKey] : ""}
            hubState={props.hubState}
            callback={props.colInfo.callback}
            key={index}
          />
        )),
      ]}
    </div>
  );
}
Column.propTypes = {
  // colInfo format
  // {rowKey: <property_in_row_object>, title: <column_title>, cellType: <cell_element_type>}
  colInfo: PropTypes.object,

  rows: PropTypes.array,
  hubState: PropTypes.object,
};

export class TableView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container-fluid table-view">
        {this.props.rows.length > 0 ? (
          ""
        ) : (
          <div className="my-4 fetching">Fetching data...</div>
        )}
        <div className="row">
          {this.props.colInfoList.map((colInfo, index) => [
            <VerticalSeparator key={index + "separator"} />,
            <Column
              colInfo={colInfo}
              rows={this.props.rows}
              hubState={this.props.hubState}
              key={index}
            />,
          ])}
        </div>
      </div>
    );
  }
}

TableView.propTypes = {
  colInfoList: PropTypes.array,
  rows: PropTypes.array,
  hubState: PropTypes.object,
};
