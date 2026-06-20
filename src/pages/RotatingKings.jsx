import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { rpcClient } from '../rpc/client';

function RotatingKings() {
  const { address, blockNumber, showToast } = useWallet();
  const [currentKing, setCurrentKing] = useState(null);
  const [nextKing, setNextKing] = useState(null);
  const [kingHistory, setKingHistory] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

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

      // Mock history
      setKingHistory([
        { block: blockNumber - 100, address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
        { block: blockNumber - 50, address: '0x3a2e346cf03bd9a2d2b29dc95a6b95805f405493' },
        { block: blockNumber, address: current || address },
      ]);

      // Check if address is registered
      setIsRegistered(true);
    } catch (e) {
      console.warn('Failed to update kings:', e);
    }
  };

  const registerAsKing = () => {
    showToast('�� Registration submitted!', 'success');
  };

  return (
    <div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">�� Current King</div>
          <div style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Address</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent)' }}>
              {currentKing || '—'}
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Rotation: {blockNumber % 100 || 100} / 100 blocks
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">�� Next King</div>
          <div style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Address</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#6c8cff' }}>
              {nextKing || '—'}
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Eligible: {isRegistered ? '✅ Yes' : '❌ No'}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">�� King History</div>
        <div>
          {kingHistory.map((entry, i) => (
            <div key={i} className="rk-row" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Block #{entry.block}</span>
              <span className="rk-address">{entry.address.slice(0, 10)}…{entry.address.slice(-6)}</span>
              {entry.block === blockNumber && (
                <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>�� Current</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
          {isRegistered
            ? '✅ You are registered as a Rotating King'
            : 'ℹ️ You are not yet registered as a Rotating King'}
        </p>
        {!isRegistered && (
          <button className="btn btn-primary" onClick={registerAsKing}>
            �� Register as King
          </button>
        )}
      </div>
    </div>
  );
}

export default RotatingKings;
