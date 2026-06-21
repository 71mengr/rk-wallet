import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { rpcClient } from '../rpc/client';
import logo from '../../images/icon-128.png';

function Dashboard() {
  const { address, balance, blockNumber, createWallet, importWallet, isConnected, showToast } = useWallet();
  const [rotatingKing, setRotatingKing] = useState(null);
  const [nextKing, setNextKing] = useState(null);
  const [importKey, setImportKey] = useState('');
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      updateKings();
    }
  }, [blockNumber, isConnected, address]);

  const updateKings = async () => {
    try {
      const current = await rpcClient.getRotatingKing(blockNumber);
      const next = await rpcClient.getRotatingKing(blockNumber + 1);
      setRotatingKing(current);
      setNextKing(next);
    } catch (e) {
      console.warn('Failed to update kings:', e);
    }
  };

  const handleImport = async () => {
    await importWallet(importKey);
    setImportKey('');
    setShowImport(false);
  };

  const registerAsKing = () => {
    showToast('Registration uses your configured TKM Chain contract endpoint.', 'info');
  };

  if (!isConnected) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <img src={logo} alt="RK Wallet logo" style={{ width: 96, height: 96, marginBottom: 16 }} />
        <h2 style={{ marginBottom: '16px' }}>Welcome to RK Wallet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Create a new wallet or import an existing private key to use TKM Chain.
        </p>
        <button className="btn btn-primary" onClick={() => createWallet()}>
          Create Wallet
        </button>
        <button className="btn btn-secondary" style={{ marginTop: '12px' }} onClick={() => setShowImport((value) => !value)}>
          Import Wallet
        </button>
        {showImport && (
          <div style={{ maxWidth: 520, margin: '18px auto 0', textAlign: 'left' }}>
            <div className="form-group">
              <label>Private Key</label>
              <input
                type="password"
                value={importKey}
                onChange={(event) => setImportKey(event.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={handleImport} disabled={!importKey.trim()}>
              Import Private Key
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Balance</div>
          <div className="balance-display">
            <div className="balance-amount">
              {balance || '0.00'} <span className="currency">RK</span>
            </div>
            <div className="address-box" onClick={() => { navigator.clipboard.writeText(address); showToast('Address copied.', 'success'); }}>
              {address}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Current King</div>
          <div style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Address</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent)' }}>
              {rotatingKing || 'Unavailable'}
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Next King: <span style={{ color: 'var(--text-primary)' }}>{nextKing || 'Unavailable'}</span>
            </div>
            <button className="btn btn-primary btn-sm btn-block" style={{ marginTop: '12px' }} onClick={registerAsKing}>
              Register as King
            </button>
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="stat-box">
          <div className="stat-value">{blockNumber || 0}</div>
          <div className="stat-label">Current Block</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{balance || '0.00'}</div>
          <div className="stat-label">Balance (RK)</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{address ? 'Connected' : 'Offline'}</div>
          <div className="stat-label">Wallet Status</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
