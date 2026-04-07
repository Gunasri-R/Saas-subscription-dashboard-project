import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = () => {
    const localBills = JSON.parse(localStorage.getItem('bills') || '[]');
    setBills(localBills);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const clearAllBills = () => {
    localStorage.removeItem('bills');
    setBills([]);
    setShowClearConfirm(false);
  };

  const downloadInvoice = (invoice, app, amount, date) => {
    const content = `INVOICE\nApp: ${app}\nInvoice: ${invoice}\nDate: ${date}\nAmount: ₹${amount}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice}.txt`;
    link.click();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F8FAFC' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#0A2647', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const totalSpent = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '16px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#0A2647' }}>Billing History</h1>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ color: '#64748B', fontSize: '14px' }}>24bct020@gmail.com</span>
            <button onClick={handleLogout} style={{ padding: '6px 12px', border: '1px solid #E2E8F0', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ maxWidth: '1200px', margin: '24px auto 0', display: 'flex', gap: '8px', padding: '0 20px' }}>
        {['Dashboard', 'Subscriptions', 'Billing', 'Analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => navigate(tab === 'Dashboard' ? '/dashboard' : `/${tab.toLowerCase()}`)}
            style={{
              padding: '8px 16px',
              background: tab === 'Billing' ? '#0A2647' : 'transparent',
              color: tab === 'Billing' ? 'white' : '#64748B',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header with Clear Button */}
      <div style={{ maxWidth: '1200px', margin: '32px auto 0', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '4px' }}>Transaction History</h2>
          <p style={{ color: '#64748B', fontSize: '14px' }}>Total spent: ₹{totalSpent}</p>
        </div>
        {bills.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            style={{
              padding: '8px 16px',
              background: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Clear History
          </button>
        )}
      </div>

      {/* Bills List */}
      <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
        {bills.length === 0 ? (
          <div style={{ background: 'white', padding: '48px', textAlign: 'center', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <p style={{ color: '#64748B' }}>No transactions yet</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            {bills.map((bill, index) => (
              <div key={index} style={{ padding: '16px', borderBottom: index < bills.length - 1 ? '1px solid #E2E8F0' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '24px' }}>{bill.appLogo}</span>
                  <div>
                    <p style={{ fontWeight: '500', color: '#0F172A', marginBottom: '2px' }}>{bill.app}</p>
                    <p style={{ color: '#64748B', fontSize: '12px' }}>{bill.date} • {bill.invoice}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontWeight: '600', color: '#059669' }}>₹{bill.amount}</span>
                  <button
                    onClick={() => downloadInvoice(bill.invoice, bill.app, bill.amount, bill.date)}
                    style={{
                      padding: '4px 12px',
                      background: 'none',
                      border: '1px solid #2C7A7B',
                      color: '#2C7A7B',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowClearConfirm(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '320px',
            width: '90%',
            textAlign: 'center'
          }} onClick={(e) => e.stopPropagation()}>
            <p style={{ marginBottom: '20px' }}>Clear all {bills.length} transactions?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={clearAllBills}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Yes
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Billing;