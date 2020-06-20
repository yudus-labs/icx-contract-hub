import React from "react";
import IconService, {
  HttpProvider,
  IconBuilder,
  IconConverter,
  IconWallet,
  SignedTransaction,
} from "icon-sdk-js";

export function iconexConnectRequest(requestType, payload) {
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

export class IconApi {
  constructor(networkInfo, authInfo) {
    this.endpoint = networkInfo.endpoint;
    this.nid = networkInfo.nid;
    this.contract = networkInfo.contract;
    this.authInfo = authInfo;
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

  async sendCallTx(method, params) {
    const provider = new HttpProvider(this.endpoint);
    const iconService = new IconService(provider);

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

    const transaction = new IconBuilder.CallTransactionBuilder()
      .from(wallet.getAddress())
      .to(this.contract)
      .stepLimit(IconConverter.toBigNumber("5000000000"))
      .nid(IconConverter.toBigNumber(this.nid))
      .nonce(IconConverter.toBigNumber("1"))
      .version(IconConverter.toBigNumber("3"))
      .timestamp(new Date().getTime() * 1000)
      .method(method)
      .params(params)
      .build();

    const signedTx = new SignedTransaction(transaction, wallet);

    return await iconService.sendTransaction(signedTx).execute();
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
