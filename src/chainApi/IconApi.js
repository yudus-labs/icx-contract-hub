import IconService, {
  HttpProvider,
  IconBuilder,
  IconConverter,
  IconWallet,
  SignedTransaction,
} from "icon-sdk-js";

export class IconApi {
  constructor(networkInfo, authInfo) {
    this.endpoint = networkInfo.endpoint;
    this.nid = networkInfo.nid;
    this.contract = networkInfo.contract;
    this.authInfo = authInfo;
  }

  // Privates methods
  //

  // _getDebugIconService() {
  //   return new IconService(new IconService.HttpProvider(this.endpoint));
  // }

  // __estimateCallStep(from, to, method, value, params = {}) {
  //   const transaction = {
  //     jsonrpc: "2.0",
  //     method: "debug_estimateStep",
  //     id: 1,
  //     params: {
  //       version: "0x3",
  //       from: from,
  //       to: to,
  //       value: IconConverter.toHex(IconConverter.toBigNumber(value)),
  //       timestamp: IconConverter.toHex(new Date().getTime() * 1000),
  //       nid: IconConverter.toHex(IconConverter.toBigNumber(this._nid)),
  //       nonce: "0x1",
  //       dataType: "call",
  //       data: {
  //         method: method,
  //         params: params,
  //       },
  //     },
  //   };

  //   return new Promise((resolve, reject) => {
  //     try {
  //       const result = this._getDebugIconService()
  //         .provider.request(transaction)
  //         .execute();
  //       resolve(result);
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // }

  __icxCallTransactionBuild(from, to, method, value, stepLimit, params = {}) {
    let callTransactionBuilder = new IconService.IconBuilder.CallTransactionBuilder()
      .from(from)
      .to(to)
      .value(IconConverter.toHex(value))
      .stepLimit(IconConverter.toBigNumber(stepLimit))
      .nid(IconConverter.toBigNumber(this.nid))
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3))
      .timestamp(new Date().getTime() * 1000)
      .method(method);

    // Optional "params" field
    if (Object.keys(params).length !== 0) {
      callTransactionBuilder = callTransactionBuilder.params(params);
    }

    return callTransactionBuilder.build();
  }

  __iconexConnectRequest(requestType, payload) {
    return new Promise((resolve, reject) => {
      function eventHandler(event) {
        const { payload } = event.detail;
        window.removeEventListener("ICONEX_RELAY_RESPONSE", eventHandler);
        resolve(payload);
      }
      window.addEventListener("ICONEX_RELAY_RESPONSE", eventHandler);

      window.dispatchEvent(
        new window.CustomEvent("ICONEX_RELAY_REQUEST", {
          detail: {
            type: requestType,
            payload,
          },
        })
      );
    });
  }

  __iconexJsonRpc(jsonRpcQuery) {
    return this.__iconexConnectRequest("REQUEST_JSON-RPC", jsonRpcQuery);
  }

  __iconexCallTransaction(from, to, method, value, stepLimit, params) {
    const transaction = this.__icxCallTransactionBuild(
      from,
      to,
      method,
      value,
      stepLimit,
      params
    );
    const jsonRpcQuery = {
      jsonrpc: "2.0",
      method: "icx_sendTransaction",
      params: IconConverter.toRawTransaction(transaction),
      id: 1234,
    };
    return this.__iconexJsonRpc(jsonRpcQuery);
  }

  // __iconexCallTransactionEst(from, to, method, value, params) {
  //   return this.__estimateCallStep(from, to, method, value, params).then(
  //     (stepLimit) => {
  //       return this.__iconexCallTransaction(
  //         from,
  //         to,
  //         method,
  //         value,
  //         stepLimit,
  //         params
  //       );
  //     }
  //   );
  // }

  // Public methods
  //
  iconexAskAddress() {
    return this.__iconexConnectRequest("REQUEST_ADDRESS");
  }

  async call(method, params) {
    const provider = new HttpProvider(this.endpoint);
    const iconService = new IconService(provider);
    const call = new IconBuilder.CallBuilder()
      .to(this.contract)
      .method(method)
      .params(params)
      .build();
    return await iconService.call(call).execute();
  }

  async sendCallTx(method, params, value) {
    const provider = new HttpProvider(this.endpoint);
    const iconService = new IconService(provider);
    var txHash;

    if (this.authInfo.iconexWallet) {
      const res = await this.__iconexCallTransaction(
        this.authInfo.iconexWallet,
        this.contract,
        method,
        value,
        "500000000",
        params
      );
      try {
        txHash = res.result;
      } catch (err) {
        throw new Error("Failed to send Tx to ICONex");
      }
    } else {
      let wallet = null;
      if (this.authInfo.pkey) {
        wallet = IconWallet.loadPrivateKey(this.authInfo.pkey);
      } else if (this.authInfo.keystore) {
        wallet = IconWallet.loadKeystore(
          JSON.parse(this.authInfo.keystore),
          this.authInfo.keystorePass
        );
      }

      if (!wallet) {
        throw new Error("Please provide contract owner authentication info");
      }

      const transaction = this.__icxCallTransactionBuild(
        wallet.getAddress(),
        this.contract,
        method,
        value,
        "500000000",
        params
      );

      const signedTx = new SignedTransaction(transaction, wallet);
      txHash = await iconService.sendTransaction(signedTx).execute();
    }

    return txHash;
  }

  async checkTx(txHash) {
    const provider = new HttpProvider(this.endpoint);
    const iconService = new IconService(provider);
    return await iconService.getTransactionResult(txHash).execute();
  }

  async getScoreApi() {
    const provider = new HttpProvider(this.endpoint);
    const iconService = new IconService(provider);
    return await iconService.getScoreApi(this.contract).execute();
  }
}
