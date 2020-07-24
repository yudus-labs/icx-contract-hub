export class ChainalyticApi {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async _postData(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "text/plain",
        // "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      // redirect: "follow", // manual, *follow, error
      // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.text(); // parses JSON response into native JavaScript objects
  }

  async _callApi(apiId, apiParams) {
    const data = {
      jsonrpc: "2.0",
      id: "id",
      method: "call_api",
      params: { api_id: apiId, api_params: apiParams },
    };
    const response = await this._postData(this.endpoint, data);
    return response ? JSON.parse(response).result : null
  }

  async latestUpstreamBlockHeight() {
    return await this._callApi("latest_upstream_block_height");
  }

  async lastBlockHeight(transformId) {
    return await this._callApi("last_block_height", {
      transform_id: transformId,
    });
  }

  async getBlock(transformId, height) {
    return await this._callApi("get_block", {
      transform_id: transformId,
      height: height,
    });
  }

  async contractInternalTransaction(address, size) {
    return await this._callApi("contract_internal_transaction", {
      address: address,
      size: size,
    });
  }

  async contractTransaction(address, size) {
    return await this._callApi("contract_transaction", {
      address: address,
      size: size,
    });
  }

  async contractStats(address) {
    return await this._callApi("contract_stats", {
      address: address,
    });
  }

  async contractList() {
    return await this._callApi("contract_list");
  }

  async maxTxPerContract() {
    return await this._callApi("max_tx_per_contract");
  }
}
