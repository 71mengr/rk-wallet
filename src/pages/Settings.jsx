import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';

function Settings() {
  const { address, blockNumber, networkInfo, logout, showToast } = useWallet();
  const [darkMode, setDarkMode] = useState(true);
  const [rpcUrl, setRpcUrl] = useState('http://187.124.217.73:8545');

  useEffect(() => {
    // Load settings
    window.electronAPI.getStore('settings').then((settings) => {
      if (settings) {
        setDarkMode(settings.darkMode !== false);
        setRpcUrl(settings.rpcUrl || 'http://187.124.217.73:8545');
      }
    });
  }, []);

  const saveSettings = async () => {
    await window.electronAPI.setStore('settings', { darkMode, rpcUrl });
    showToast('✅ Settings saved!', 'success');
  };

  const exportWallet = () => {
    showToast('�� Wallet export coming soon', 'info');
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">⚙️ General Settings</div>
        <div className="form-group">
          <label>Network</label>
          <select value={networkInfo.chainId || 12345}>
            <option value={12345}>TKM Chain (Mainnet)</option>
          </select>
        </div>
        <div className="form-group">
          <label>RPC URL</label>
          <input
            type="text"
            value={rpcUrl}
            onChange={(e) => setRpcUrl(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            Dark Mode
          </label>
        </div>
        <button className="btn btn-primary" onClick={saveSettings}>
          �� Save Settings
        </button>
      </div>

      <div className="card">
        <div className="card-title">�� Wallet</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Address: <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{address || '—'}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={exportWallet}>
            �� Export Wallet
          </button>
          <button className="btn btn-danger" onClick={logout}>
            �� Logout
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">ℹ️ About</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <p><strong>RK Wallet</strong> v1.0.0</p>
          <p>TKM Chain — RandomX Mining & Rotating Kings</p>
          <p style={{ marginTop: '8px', fontSize: '0.75rem' }}>
            Block: #{blockNumber || '—'} | Network: {networkInfo.name || 'TKM Chain'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
