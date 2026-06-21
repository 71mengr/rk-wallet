import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';

function Transactions() {
  const { address } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTransactions([]);
    setLoading(false);
  }, [address]);

  if (!address) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Create or import a wallet to view transactions</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">Transaction History</div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          No local transaction history yet. New sends from this wallet session will appear after broadcast support is extended.
        </div>
      ) : null}
    </div>
  );
}

export default Transactions;
