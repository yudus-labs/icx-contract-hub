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

import "./TransactionPanel.css";

export function TransactionPanel(props) {
  const [state, setState] = useState({
    txs: [],
    numOfTx: 10,
    txResult: {},
    txHash: "",
    maxTx: "N/A",
    txCount: 0,
    contractName: "N/A",
  });

  useEffect(() => {
    const chainalyticApi = new ChainalyticApi(
      props.hubState.network.chainalytic_endpoint
    );
    const iconApi = new IconApi({
      endpoint: props.hubState.network.loopchain_endpoint,
      nid: props.hubState.network.network_id,
      contract: props.hubState.contract,
    });

    const interval = setInterval(async () => {
      let txs = await chainalyticApi.contractTransaction(
        props.hubState.contract,
        state.numOfTx
      );
      try {
        txs = txs.result.transactions.reverse();
      } catch {
        txs = [];
      }

      let maxTx = await chainalyticApi.maxTxPerContract();
      try {
        maxTx = maxTx.result;
      } catch {
        maxTx = "N/A";
      }

      let txCount = await chainalyticApi.contractStats(props.hubState.contract);
      try {
        txCount = txCount.result.stats.tx_count;
      } catch {
        txCount = 0;
      }

      try {
        var cxName = await iconApi.call("name", {});
      } catch (err) {
        cxName = "Contract not found";
      }

      // console.log(`Transactions: ${JSON.stringify(txs, null, 2)}`);
      setState((s) => ({
        numOfTx: s.numOfTx,
        txs: txs,
        txResult: s.txResult,
        txHash: s.txHash,
        maxTx: maxTx,
        txCount: txCount,
        contractName: cxName,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [
    props.hubState.network.chainalytic_endpoint,
    props.hubState.network.loopchain_endpoint,
    props.hubState.network.network_id,
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
      contractName: s.contractName,
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
              { rowKey: "from", title: "From", cellType: AddressCell },
              { rowKey: "value", title: "Amount", cellType: AmountCell },
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
      <br />
      <div className="row">
        <div className="col-auto">
          Contract name : <b>{state.contractName}</b> | Address :{" "}
          <b>{props.hubState.contract}</b>
        </div>
      </div>
    </div>
  );
}

TransactionPanel.propTypes = {
  hubState: PropTypes.object,
  updateHubState: PropTypes.func,
};
