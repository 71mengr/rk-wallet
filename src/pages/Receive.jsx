import React from 'react';
import { useWallet } from '../context/WalletContext';
import { QRCodeSVG } from 'qrcode.react';

function Receive() {
  const { address } = useWallet();

  if (!address) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Create or import a wallet first</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="card-title" style={{ justifyContent: 'center' }}>�� Receive RK</div>
        <div className="qr-container">
          <QRCodeSVG value={address} size={200} bgColor="white" fgColor="#0a0e1a" />
        </div>
        <div style={{ marginTop: '12px' }}>
          <div className="address-box" style={{ display: 'inline-block', maxWidth: '100%' }}>
            {address}
          </div>
        </div>
        <button
          className="btn btn-primary"
          style={{ marginTop: '12px', display: 'inline-flex' }}
          onClick={() => { navigator.clipboard.writeText(address); }}
        >
          �� Copy Address
        </button>
        <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Share this address to receive RK tokens
        </p>
      </div>
    </div>
  );
}

export default Receive;
