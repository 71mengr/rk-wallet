import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { rpcClient } from '../rpc/client';

function RotatingKings() {
  const { blockNumber, showToast } = useWallet();
  const [currentKing, setCurrentKing] = useState(null);
  const [nextKing, setNextKing] = useState(null);

  useEffect(() => {
    if (blockNumber) {
      updateKings();
    }
  }, [blockNumber]);

  const updateKings = async () => {
    try {
      const current = await rpcClient.getRotatingKing(blockNumber);
      const next = await rpcClient.getRotatingKing(blockNumber + 1);
      setCurrentKing(current);
      setNextKing(next);
    } catch (e) {
      console.warn('Failed to update kings:', e);
    }
  };

  const registerAsKing = () => {
    showToast('Registration requires the deployed TKM Chain registration contract method.', 'info');
  };

  return (
    <div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Current King</div>
          <div style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Address</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent)' }}>
              {currentKing || 'Unavailable'}
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Rotation: {blockNumber % 100 || 100} / 100 blocks
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Next King</div>
          <div style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Address</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#6c8cff' }}>
              {nextKing || 'Unavailable'}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Use your connected wallet to submit Rotating King registration when the contract endpoint is available.
        </p>
        <button className="btn btn-primary" onClick={registerAsKing}>
          Register as King
        </button>
      </div>
    </div>
  );
}

export default RotatingKings;
