import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ChainalyticApi } from "../../../chainApi/ChainalyticApi.js";
import {
  TableView,
  HashCell,
  BlockCell,
  AgeCell,
  AddressCell,
  AmountCell,
  FeeCell,
  ExecuteTxCell,
} from "../../../common/TableView";

import "./TransactionPanel.css";

export function TransactionPanel(props) {
  const [state, setState] = useState({
    txs: [],
    numOfTx: 10,
  });

  useEffect(() => {
    const chainalyticApi = new ChainalyticApi(
      props.hubState.network.chainalytic_endpoint
    );
    const interval = setInterval(async () => {
      let txs = await chainalyticApi.contractTransaction(
        props.hubState.contract,
        state.numOfTx
      );
      txs = txs ? txs.result.transactions : [];
      setState((s) => ({ numOfTx: s.numOfTx, txs: txs.reverse() }));
      // console.log(`Transactions: ${JSON.stringify(txs, null, 2)}`);
    }, 2000);
    return () => clearInterval(interval);
  }, [
    props.hubState.network.chainalytic_endpoint,
    props.hubState.contract,
    state,
  ]);

  return (
    <div className="container-fluid transaction-panel">
      <TableView
        colInfoList={[
          { rowKey: "hash", title: "Hash", cellType: HashCell },
          { rowKey: "height", title: "Block", cellType: BlockCell },
          { rowKey: "timestamp", title: "Age", cellType: AgeCell },
          { rowKey: "from", title: "From", cellType: AddressCell },
          { rowKey: "value", title: "Amount", cellType: AmountCell },
          { rowKey: "fee", title: "Fee", cellType: FeeCell },
          { rowKey: "", title: "", cellType: ExecuteTxCell },
        ]}
        rows={state.txs}
        hubState={props.hubState}
      />
      <br />
      <div className="row align-items-center">
        <div className="col-auto">Show latest</div>
        <div className="col-1">
          <input
            type="text"
            className="form-control"
            id="num-of-latest-tx"
            value={state.numOfTx || 10}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.persist();
                setState((s) => ({ txs: s.txs, numOfTx: e.target.value }));
              }
            }}
            onChange={(e) => {
              e.persist();
              setState((s) => ({ txs: s.txs, numOfTx: e.target.value }));
            }}
            title="Number of latest transactions"
            placeholder="Number of latest transactions"
            required
          />
        </div>
        <div className="col-auto">transactions</div>
      </div>
    </div>
  );
}

TransactionPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
