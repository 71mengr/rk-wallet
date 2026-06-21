import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';

function Header({ pageTitle }) {
  const { address, blockNumber, isConnected, showToast } = useWallet();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      showToast('Address copied.', 'success');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <span className="page-title">{pageTitle}</span>
      </div>
      <div className="header-right">
        <span className="block-info">
          <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
          Block: {blockNumber || '—'}
        </span>
        {address && (
          <button
            onClick={copyAddress}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: '4px',
              transition: '0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--bg-hover)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            {address.slice(0, 10)}…{address.slice(-6)}
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
