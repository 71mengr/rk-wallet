import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const navItems = [
	  { path: '/', icon: '��', label: 'Dashboard' },
	  { path: '/send', icon: '��', label: 'Send' },
	  { path: '/receive', icon: '��', label: 'Receive' },
	  { path: '/transactions', icon: '��', label: 'Transactions' },
	  { path: '/rotating-kings', icon: '��', label: 'RK Status', badge: 'Kings' },
	  { path: '/settings', icon: '⚙️', label: 'Settings' },
];

function Sidebar() {
	  const { address } = useWallet();

	  return (
		      <div className="sidebar">
		        <div className="sidebar-logo">
		          <span>��</span>
		          <span>RK</span>
		          <small>Wallet</small>
		        </div>

		        <nav className="sidebar-nav">
		          {navItems.map((item) => (
				            <NavLink
				              key={item.path}
				              to={item.path}
				              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
				            >
				              <span className="icon">{item.icon}</span>
				              <span className="label">{item.label}</span>
				              {item.badge && <span className="badge">{item.badge}</span>}
				            </NavLink>
				          ))}
		        </nav>

		        <div className="sidebar-footer">
		          {address ? (
				            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
				              {address.slice(0, 8)}...{address.slice(-6)}
				            </div>
				          ) : (
						            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
						              No wallet connected
						            </div>
						          )}
		        </div>
		      </div>
		    );
}

export default Sidebar;
