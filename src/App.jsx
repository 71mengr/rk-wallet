import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Send from './pages/Send';
import Receive from './pages/Receive';
import Transactions from './pages/Transactions';
import RotatingKings from './pages/RotatingKings';
import Settings from './pages/Settings';
import { WalletProvider } from './context/WalletContext';

function App() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Dashboard');

  useEffect(() => {
    const titles = {
      '/': 'Dashboard',
      '/send': 'Send',
      '/receive': 'Receive',
      '/transactions': 'Transactions',
      '/rotating-kings': 'Rotating Kings',
      '/settings': 'Settings'
    };
    setPageTitle(titles[location.pathname] || 'Dashboard');
  }, [location]);

  return (
    <WalletProvider>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Header pageTitle={pageTitle} />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/send" element={<Send />} />
              <Route path="/receive" element={<Receive />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/rotating-kings" element={<RotatingKings />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </WalletProvider>
  );
}

export default App;
