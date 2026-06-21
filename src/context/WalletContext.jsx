import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { rpcClient } from '../rpc/client';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState('0');
  const [address, setAddress] = useState('');
  const [blockNumber, setBlockNumber] = useState(0);
  const [networkInfo] = useState({ name: 'TKM Chain', chainId: 12345 });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Load wallet from storage
  useEffect(() => {
    const loadWallet = async () => {
      try {
        const stored = await window.electronAPI.getStore('wallet');
        await rpcClient.loadSettings();
        if (stored?.privateKey) {
          const walletInstance = new ethers.Wallet(stored.privateKey, rpcClient.getProvider());
          setWallet(walletInstance);
          setAddress(walletInstance.address);
          setIsConnected(true);
          updateBalance(walletInstance.address);
        }
      } catch (e) {
        console.error('Failed to load wallet:', e);
      }
    };
    loadWallet();
  }, []);

  // Auto update balance
  useEffect(() => {
    if (address) {
      const interval = setInterval(() => updateBalance(address), 15000);
      const blockInterval = setInterval(() => updateBlockNumber(), 5000);
      return () => {
        clearInterval(interval);
        clearInterval(blockInterval);
      };
    }
  }, [address]);

  const updateBalance = async (addr) => {
    try {
      const bal = await rpcClient.getBalance(addr || address);
      setBalance(bal);
      return bal;
    } catch (e) {
      console.warn('Balance update failed:', e);
      return '0';
    }
  };

  const updateBlockNumber = async () => {
    try {
      const block = await rpcClient.getBlockNumber();
      setBlockNumber(block);
      return block;
    } catch (e) {
      console.warn('Block update failed:', e);
      return 0;
    }
  };

  const createWallet = async (password) => {
    setLoading(true);
    try {
      const newWallet = ethers.Wallet.createRandom().connect(rpcClient.getProvider());
      setWallet(newWallet);
      setAddress(newWallet.address);
      setIsConnected(true);
      await window.electronAPI.setStore('wallet', {
        privateKey: newWallet.privateKey,
        address: newWallet.address
      });
      // Encrypt and save keystore
      if (password) {
        const keystore = await newWallet.encrypt(password);
        await window.electronAPI.setStore('keystore', keystore);
      }
      await updateBalance(newWallet.address);
      showToast('✅ Wallet created successfully!', 'success');
      return newWallet;
    } catch (e) {
      showToast('❌ Failed to create wallet: ' + e.message, 'error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const importWallet = async (privateKey) => {
    setLoading(true);
    try {
      const normalizedKey = privateKey.trim();
      const keyWithPrefix = normalizedKey.startsWith('0x') ? normalizedKey : `0x${normalizedKey}`;
      if (!ethers.utils.isHexString(keyWithPrefix, 32)) {
        throw new Error('Enter a valid 64-character private key, with or without 0x.');
      }
      const walletInstance = new ethers.Wallet(keyWithPrefix, rpcClient.getProvider());
      setWallet(walletInstance);
      setAddress(walletInstance.address);
      setIsConnected(true);
      await window.electronAPI.setStore('wallet', {
        privateKey: walletInstance.privateKey,
        address: walletInstance.address
      });
      await updateBalance(walletInstance.address);
      showToast('✅ Wallet imported successfully!', 'success');
      return walletInstance;
    } catch (e) {
      showToast('❌ Failed to import wallet: ' + e.message, 'error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const sendTransaction = async (to, amount) => {
    if (!wallet) throw new Error('No wallet loaded');
    setLoading(true);
    try {
      const tx = await wallet.connect(rpcClient.getProvider()).sendTransaction({
        to,
        value: ethers.utils.parseEther(amount.toString()),
        gasLimit: 21000
      });
      showToast(`✅ Transaction sent! ${tx.hash.slice(0, 16)}...`, 'success');
      await updateBalance(address);
      return tx;
    } catch (e) {
      showToast('❌ Transaction failed: ' + e.message, 'error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const logout = async () => {
    setWallet(null);
    setAddress('');
    setIsConnected(false);
    await window.electronAPI.deleteStore('wallet');
    showToast('✅ Logged out', 'success');
  };

  return (
    <WalletContext.Provider value={{
      wallet,
      address,
      balance,
      blockNumber,
      networkInfo,
      isConnected,
      loading,
      toast,
      createWallet,
      importWallet,
      sendTransaction,
      updateBalance,
      updateBlockNumber,
      showToast,
      logout,
      setWallet,
      setAddress
    }}>
      {children}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        </div>
      )}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
