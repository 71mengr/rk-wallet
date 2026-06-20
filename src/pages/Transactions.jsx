import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { rpcClient } from '../rpc/client';

function Transactions() {
  const { address } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) {
      loadTransactions();
    }
  }, [address]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // Mock transactions for demo
      setTransactions([
        {
          hash: '0x1234...5678',
          type: 'sent',
          amount: '10.50',
          to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          timestamp: Date.now() - 3600000
        },
        {
          hash: '0x8765...4321',
          type: 'received',
          amount: '5.25',
          from: '0x3a2e346cf03bd9a2d2b29dc95a6b95805f405493',
          timestamp: Date.now() - 7200000
        },
        {
          hash: '0xabcd...ef12',
          type: 'king_reward',
          amount: '20.00',
          note: 'Rotating King Reward',
          timestamp: Date.now() - 86400000
        }
      ]);
    } catch (e) {
      console.warn('Failed to load transactions:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return new Date(timestamp).toLocaleDateString();
  };

  const getTypeLabel = (type) => {
    const labels = {
      sent: '�� Sent',
      received: '�� Received',
      king_reward: '�� King Reward',
      mining: '⛏️ Mining'
    };
    return labels[type] || type;
  };

  if (!address) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Create or import a wallet to view transactions</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">�� Transaction History</div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          ⏳ Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          No transactions yet
        </div>
      ) : (
        transactions.map((tx, i) => (
          <div key={i} className="rk-row" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: '500' }}>{getTypeLabel(tx.type)}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {tx.hash.slice(0, 16)}... | {formatTime(tx.timestamp)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: tx.type === 'sent' ? 'var(--danger)' : 'var(--success)' }}>
                {tx.type === 'sent' ? '-' : '+'}{tx.amount} RK
              </div>
              {tx.note && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{tx.note}</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Transactions;
