import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { rpcClient } from '../rpc/client';
import { QRCodeSVG } from 'qrcode.react';

function Dashboard() {
  const { address, balance, blockNumber, wallet, createWallet, isConnected, showToast } = useWallet();
  const [rotatingKing, setRotatingKing] = useState(null);
  const [nextKing, setNextKing] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    if (isConnected && address) {
      updateKings();
    }
  }, [blockNumber, isConnected]);

  const updateKings = async () => {
    try {
      const current = await rpcClient.getRotatingKing(blockNumber);
      const next = await rpcClient.getRotatingKing(blockNumber + 1);
      setRotatingKing(current);
      setNextKing(next);

      // Mock registrations
      setRegistrations([
        { address: address, status: 'Current' },
        { address: '0x3a2e346cf03bd9a2d2b29dc95a6b95805f405493', status: 'Next' },
        { address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', status: 'Registered' },
      ]);
    } catch (e) {
      console.warn('Failed to update kings:', e);
    }
  };

  const registerAsKing = () => {
    showToast('�� Registration request sent!', 'success');
  };

  if (!isConnected) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <h2 style={{ marginBottom: '16px' }}>�� Welcome to RK Wallet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Connect to the TKM Chain and manage your assets
        </p>
        <button className="btn btn-primary" onClick={() => createWallet()}>
          �� Create Wallet
        </button>
        <button className="btn btn-secondary" style={{ marginTop: '12px' }} onClick={() => {}}>
          �� Import Wallet
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid-2">
        {/* Balance Card */}
        <div className="card">
          <div className="card-title">�� Balance</div>
          <div className="balance-display">
            <div className="balance-amount">
              {balance || '0.00'} <span className="currency">RK</span>
            </div>
            <div className="balance-usd">
              ≈ ${(parseFloat(balance || '0') * 2.50).toFixed(2)} USD
            </div>
            <div className="address-box" onClick={() => { navigator.clipboard.writeText(address); showToast('�� Copied!', 'success'); }}>
              {address}
            </div>
          </div>
        </div>

        {/* Current King */}
        <div className="card">
          <div className="card-title">�� Current King</div>
          <div style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Address</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent)' }}>
              {rotatingKing || address}
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Next Rotation: <span style={{ color: 'var(--text-primary)' }}>63 blocks</span>
            </div>
            <button className="btn btn-primary btn-sm btn-block" style={{ marginTop: '12px' }} onClick={registerAsKing}>
              �� Register as King
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
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
          <div className="stat-value">120 s</div>
          <div className="stat-label">Block Time</div>
        </div>
      </div>

      {/* Registered Kings */}
      <div className="card">
        <div className="card-title">�� Registered Kings</div>
        <div>
          {registrations.map((reg, i) => (
            <div key={i} className="rk-row" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="rk-address">{reg.address.slice(0, 10)}…{reg.address.slice(-6)}</span>
              <span style={{ fontSize: '0.75rem', color: reg.status === 'Current' ? 'var(--accent)' : 'var(--text-secondary)' }}>
                {reg.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
