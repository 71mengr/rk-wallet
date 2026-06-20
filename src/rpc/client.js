import { ethers } from 'ethers';

const RPC_URL = 'http://187.124.217.73:8545';

export const rpcClient = {
  getProvider() {
    return new ethers.providers.JsonRpcProvider(RPC_URL);
  },

  async call(method, params = []) {
    const response = await fetch(RPC_URL, {
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
    return await this.call('eth_getBlockByNumber', [
      '0x' + blockNumber.toString(16),
      false
    ]);
  },

  async getTransactionCount(address) {
    return await this.call('eth_getTransactionCount', [address, 'pending']);
  },

  async sendRawTransaction(signedTx) {
    return await this.call('eth_sendRawTransaction', [signedTx]);
  },

  async getGasPrice() {
    return await this.call('eth_gasPrice', []);
  },

  // Rotating Kings specific
  async getMainKing() {
    try {
      return await this.call('eth_call', [{
        to: '0x0000000000000000000000000000000000000001',
        data: '0x6b7d9e6a'
      }, 'latest']);
    } catch {
      return '0x0000000000000000000000000000000000000000';
    }
  },

  async getRotatingKing(blockNumber) {
    try {
      const block = blockNumber || await this.getBlockNumber();
      const index = Math.floor(block / 100);
      const data = '0x6b7d9e6a' + index.toString(16).padStart(64, '0');
      return await this.call('eth_call', [{
        to: '0x0000000000000000000000000000000000000001',
        data
      }, 'latest']);
    } catch {
      return '0x0000000000000000000000000000000000000000';
    }
  }
};
