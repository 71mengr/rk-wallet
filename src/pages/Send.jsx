import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';

function Send() {
  const { sendTransaction, balance } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    if (!recipient || !recipient.startsWith('0x') || recipient.length !== 42) {
      setStatus('❌ Invalid address');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setStatus('❌ Invalid amount');
      return;
    }
    if (parseFloat(amount) > parseFloat(balance)) {
      setStatus('❌ Insufficient balance');
      return;
    }

    setLoading(true);
    setStatus('⏳ Sending...');
    try {
      await sendTransaction(recipient, parseFloat(amount));
      setStatus('✅ Transaction sent!');
      setRecipient('');
      setAmount('');
    } catch (e) {
      setStatus('❌ ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">�� Send RK</div>
        <div className="form-group">
          <label>Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
          />
        </div>
        <div className="form-group">
          <label>Amount (RK)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.000001"
            min="0"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Balance: {balance || '0.00'} RK
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setAmount(balance)}
          >
            Max
          </button>
        </div>
        <button
          className="btn btn-primary btn-block"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? '⏳ Sending...' : '�� Send'}
        </button>
        {status && (
          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '0.9rem' }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

export default Send;
