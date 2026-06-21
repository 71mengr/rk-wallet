import { ethers } from 'ethers';

const DEFAULT_RPC_URL = 'http://187.124.217.73:8545';

let rpcUrl = DEFAULT_RPC_URL;

export const rpcClient = {
  getRpcUrl() {
    return rpcUrl;
  },

  setRpcUrl(url) {
    rpcUrl = url?.trim() || DEFAULT_RPC_URL;
  },

  async loadSettings() {
    const settings = await window.electronAPI?.getStore('settings');
    this.setRpcUrl(settings?.rpcUrl);
    return rpcUrl;
  },

  getProvider() {
    return new ethers.providers.JsonRpcProvider(rpcUrl);
  },

  async call(method, params = []) {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: Date.now()
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.result;
  },

  async getBalance(address) {
    const hex = await this.call('eth_getBalance', [address, 'latest']);
    return ethers.utils.formatEther(hex);
  },

  async getBlockNumber() {
    const hex = await this.call('eth_blockNumber', []);
    return parseInt(hex, 16);
  },

  async getBlock(blockNumber) {
    return this.call('eth_getBlockByNumber', [
      '0x' + blockNumber.toString(16),
      true
    ]);
  },

  async getTransactionCount(address) {
    return this.call('eth_getTransactionCount', [address, 'pending']);
  },

  async sendRawTransaction(signedTx) {
    return this.call('eth_sendRawTransaction', [signedTx]);
  },

  async getGasPrice() {
    return this.call('eth_gasPrice', []);
  },

  async getRotatingKing(blockNumber) {
    const block = blockNumber || await this.getBlockNumber();
    const index = Math.floor(block / 100);
    const data = '0x6b7d9e6a' + index.toString(16).padStart(64, '0');
    return this.call('eth_call', [{
      to: '0x0000000000000000000000000000000000000001',
      data
    }, 'latest']);
  }
};
