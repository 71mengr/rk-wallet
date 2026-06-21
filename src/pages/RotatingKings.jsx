import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { rpcClient } from '../rpc/client';

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return value;
};

function RotatingKings() {
  const { blockNumber, showToast } = useWallet();
  const [status, setStatus] = useState(null);
  const [kings, setKings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    updateKings();
  }, [blockNumber]);

  const updateKings = async () => {
    try {
      setError('');
      const rkStatus = await rpcClient.getRkStatus();
      const rkList = rkStatus?.kings?.length ? rkStatus.kings : await rpcClient.getRkList();
      setStatus(rkStatus);
      setKings(rkList || []);
    } catch (e) {
      console.warn('Failed to update kings:', e);
      setError(e.message);
    }
  };

  const registerAsKing = async () => {
    try {
      await rpcClient.addRk();
      showToast('Rotating King registration submitted.', 'success');
      await updateKings();
    } catch (e) {
      showToast(`Registration failed: ${e.message}`, 'error');
    }
  };

  return (
    <div>
      <div className="grid-3">
        <div className="stat-box">
          <div className="stat-value">{formatValue(status?.currentBlock ?? blockNumber)}</div>
          <div className="stat-label">Current Block</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{formatValue(status?.registeredKings ?? kings.length)}</div>
          <div className="stat-label">Registered Kings</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{formatValue(status?.blocksUntilRotation)}</div>
          <div className="stat-label">Blocks Until Rotation</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Current King</div>
          <div className="rk-address rk-address-large">{status?.currentKing || status?.mainKing || 'Unavailable'}</div>
        </div>

        <div className="card">
          <div className="card-title">Next King</div>
          <div className="rk-address rk-address-large">{status?.nextKing || 'Unavailable'}</div>
          <div className="rk-muted">Next rotation height: {formatValue(status?.nextRotationHeight)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Registered Kings</div>
        {error && <div className="rk-error">{error}</div>}
        {!error && kings.length === 0 && <div className="rk-muted">No registered kings returned by the RK endpoint.</div>}
        {kings.map((king) => (
          <div className="rk-card" key={king.address}>
            <div className="rk-row">
              <span className="rk-label">Address</span>
              <span className="rk-address">{king.address}</span>
            </div>
            <div className="rk-row">
              <span className="rk-label">Role</span>
              <span className="rk-percent main">{king.current ? 'Current' : king.next ? 'Next' : 'Registered'}</span>
            </div>
            <div className="rk-row">
              <span className="rk-label">Blocks Until Rotation</span>
              <span>{formatValue(king.blocksUntilRotation)}</span>
            </div>
            <div className="rk-row">
              <span className="rk-label">Locked Amount</span>
              <span>{formatValue(king.lockedAmount)}</span>
            </div>
            <div className="rk-row">
              <span className="rk-label">Total Received</span>
              <span>{formatValue(king.totalReceived)}</span>
            </div>
            {king.unlockTime && (
              <div className="rk-row">
                <span className="rk-label">Unlock Time</span>
                <span>{king.unlockTime}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Use your connected wallet to submit Rotating King registration.
        </p>
        <button className="btn btn-primary" onClick={registerAsKing}>
          Register as King
        </button>
      </div>
    </div>
  );
}

export default RotatingKings;
