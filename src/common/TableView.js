import React from "react";
import PropTypes from "prop-types";
import { VerticalSeparator } from "./Util";
import { ChainalyticApi } from "../chainApi/ChainalyticApi";

import "./TableView.css";

// ================================================================================================
// Cells

export function HashCell(props) {
  return (
    <div className="row justify-content-center hash-cell">
      {props.cellValue.slice(0, 8)}..
      {props.cellValue.slice(
        props.cellValue.length - 7,
        props.cellValue.length - 1
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
  return (
    <div className="row justify-content-center age-cell">{props.cellValue}</div>
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
        props.cellValue.length - 7,
        props.cellValue.length - 1
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
      {props.cellValue || 0} ICX
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

export function ExecuteTxCell(props) {
  return (
    <div className="row justify-content-center execute-cell">
      {props.cellValue}
    </div>
  );
}
ExecuteTxCell.propTypes = {
  cellValue: PropTypes.any,
  hubState: PropTypes.object,
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
