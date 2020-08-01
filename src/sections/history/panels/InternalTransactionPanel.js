import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ChainalyticApi } from "../../../chainApi/ChainalyticApi.js";
import { IconApi } from "../../../chainApi/IconApi.js";
import {
  TableView,
  HashCell,
  BlockCell,
  AgeCell,
  AddressCell,
  AmountCell,
  FeeCell,
  CheckTxCell,
} from "../../../common/TableView";

import "./InternalTransactionPanel.css";

export function InternalTransactionPanel(props) {
  const [state, setState] = useState({
    txs: [],
    numOfTx: 10,
    txResult: {},
    txHash: "",
    maxTx: "N/A",
    txCount: 0,
  });

  useEffect(() => {
    const chainalyticApi = new ChainalyticApi(
      props.hubState.network.chainalytic_endpoint
    );
    const interval = setInterval(async () => {
      let txs = await chainalyticApi.contractInternalTransaction(
        props.hubState.contract,
        state.numOfTx
      );
      txs = txs ? txs.result.transactions.reverse() : [];

      let maxTx = await chainalyticApi.maxTxPerContract();
      maxTx = maxTx ? maxTx.result : "N/A";

      let txCount = await chainalyticApi.contractStats(props.hubState.contract);
      txCount = txCount ? txCount.result.stats.itx_count : 0;

      // console.log(`Transactions: ${JSON.stringify(txs, null, 2)}`);
      setState((s) => ({
        numOfTx: s.numOfTx,
        txs: txs,
        txResult: s.txResult,
        txHash: s.txHash,
        maxTx: maxTx,
        txCount: txCount,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [
    props.hubState.network.chainalytic_endpoint,
    props.hubState.contract,
    state,
  ]);

  const checkTx = async (txHash) => {
    let txResult = "";

    try {
      const api = new IconApi({
        endpoint: props.hubState.network.loopchain_endpoint,
        nid: props.hubState.network.network_id,
        contract: props.hubState.contract,
      });
      txResult = await api.checkTx(txHash);
    } catch (err) {
      txResult = err;
    }

    setState((s) => ({
      numOfTx: s.numOfTx,
      txs: s.txs,
      txResult: txResult,
      txHash: txHash,
      maxTx: s.maxTx,
      txCount: s.txCount,
    }));
  };

  return (
    <div className="container-fluid transaction-panel">
      <div className="row">
        <div className="col-auto">
          <TableView
            colInfoList={[
              { rowKey: "hash", title: "Hash", cellType: HashCell },
              { rowKey: "height", title: "Block", cellType: BlockCell },
              { rowKey: "timestamp", title: "Local Time", cellType: AgeCell },
              { rowKey: "itx_target", title: "To", cellType: AddressCell },
              { rowKey: "itx_value", title: "Amount", cellType: AmountCell },
              { rowKey: "fee", title: "Fee", cellType: FeeCell },
              {
                rowKey: "hash",
                title: ">>",
                cellType: CheckTxCell,
                callback: checkTx,
              },
            ]}
            rows={state.txs}
            hubState={props.hubState}
          />
        </div>
        <div className="col">
          <div className="row my-1">
            <b>Tx Result of : </b> &nbsp;{state.txHash}
          </div>
          <div className="row">
            <textarea
              value={JSON.stringify(state.txResult, null, 2)}
              readOnly={true}
              className="form-control text-area"
              rows="10"
            />
          </div>
        </div>
      </div>
      <br />

      <div className="row align-items-center">
        <div className="col-auto">Show last</div>
        <div className="col-1">
          <input
            type="text"
            className="form-control"
            id="num-of-latest-tx"
            value={state.numOfTx || 10}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.persist();
                setState((s) => ({
                  txs: s.txs,
                  numOfTx: e.target.value,
                  txResult: s.txResult,
                  txHash: s.txHash,
                  maxTx: s.maxTx,
                  txCount: s.txCount,
                }));
              }
            }}
            onChange={(e) => {
              e.persist();
              setState((s) => ({
                txs: s.txs,
                numOfTx: e.target.value,
                txResult: s.txResult,
                txHash: s.txHash,
                maxTx: s.maxTx,
                txCount: s.txCount,
              }));
            }}
            title="Number of latest transactions"
            placeholder="Number of latest transactions"
            required
          />
        </div>
        <div className="col-auto">
          {" "}
          of latest {state.maxTx} transactions ({" "}
          {state.txCount.toLocaleString()} in total )
        </div>
      </div>
    </div>
  );
}

InternalTransactionPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
