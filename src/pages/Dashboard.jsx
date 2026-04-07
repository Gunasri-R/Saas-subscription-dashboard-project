import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const subsData = await api.getSubscriptions();
      setSubscriptions(subsData);
      const localBills = JSON.parse(localStorage.getItem('bills') || '[]');
      setBills(localBills);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // ✅ Calculate ACTUAL spending from bills
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // This month's spending
  const thisMonthBills = bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
  });
  const thisMonthSpent = thisMonthBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Last month's spending
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthBills = bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate.getMonth() === lastMonth && billDate.getFullYear() === lastMonthYear;
  });
  const lastMonthSpent = lastMonthBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Last 12 months spending
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(currentYear - 1);
  const yearlyBills = bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate >= oneYearAgo;
  });
  const yearlySpent = yearlyBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Average monthly spend
  const monthsWithData = new Set(bills.map(bill => {
    const d = new Date(bill.date);
    return `${d.getMonth()}-${d.getFullYear()}`;
  })).size;
  const avgMonthly = monthsWithData > 0 ? Math.round(yearlySpent / monthsWithData) : 0;

  // Calculate growth percentage
  const growthPercent = lastMonthSpent > 0 
    ? Math.round(((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100)
    : 0;

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#F8FAFC'
      }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#0A2647', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '16px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#0A2647' }}>Dashboard</h1>
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
              background: tab === 'Dashboard' ? '#0A2647' : 'transparent',
              color: tab === 'Dashboard' ? 'white' : '#64748B',
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

      {/* Welcome Section */}
      <div style={{ maxWidth: '1200px', margin: '32px auto 0', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0F172A', marginBottom: '8px' }}>
          Welcome back, <span style={{ color: '#2C7A7B' }}>Gunasri!</span>
        </h2>
        <p style={{ color: '#64748B', fontSize: '14px' }}>Here's your spending overview</p>
      </div>

      {/* Main Stats Cards */}
      <div style={{ maxWidth: '1200px', margin: '24px auto 0', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {/* This Month */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '8px' }}>This Month</p>
          <p style={{ fontSize: '28px', fontWeight: '600', color: '#059669', margin: 0 }}>₹{thisMonthSpent}</p>
          <p style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>
            {thisMonthBills.length} payment{thisMonthBills.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Last Month */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '8px' }}>Last Month</p>
          <p style={{ fontSize: '28px', fontWeight: '600', color: '#D97706', margin: 0 }}>₹{lastMonthSpent}</p>
          <p style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>
            {lastMonthBills.length} payment{lastMonthBills.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Total Spent (All Time) */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '8px' }}>Total Spent</p>
          <p style={{ fontSize: '28px', fontWeight: '600', color: '#0A2647', margin: 0 }}>₹{yearlySpent}</p>
          <p style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>Last 12 months</p>
        </div>

        {/* Monthly Average */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '8px' }}>Monthly Avg</p>
          <p style={{ fontSize: '28px', fontWeight: '600', color: '#2C7A7B', margin: 0 }}>₹{avgMonthly}</p>
          <p style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>
            over {monthsWithData} month{monthsWithData !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{ maxWidth: '1200px', margin: '20px auto 0', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {/* Active Subscriptions */}
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Active Subscriptions</p>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#0F172A', margin: 0 }}>{subscriptions.length}</p>
          </div>
          <div style={{ fontSize: '24px' }}>📱</div>
        </div>

        {/* Total Transactions */}
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Transactions</p>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#0F172A', margin: 0 }}>{bills.length}</p>
          </div>
          <div style={{ fontSize: '24px' }}>📄</div>
        </div>

        {/* Growth vs Last Month */}
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>vs Last Month</p>
            <p style={{ fontSize: '20px', fontWeight: '600', color: growthPercent >= 0 ? '#059669' : '#DC2626', margin: 0 }}>
              {growthPercent > 0 ? '+' : ''}{growthPercent}%
            </p>
          </div>
          <div style={{ fontSize: '24px' }}>{growthPercent >= 0 ? '📈' : '📉'}</div>
        </div>
      </div>

      {/* Recent Activity */}
      {bills.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', margin: 0 }}>Recent Transactions</h3>
            <button 
              onClick={() => navigate('/billing')}
              style={{ background: 'none', border: 'none', color: '#2C7A7B', fontSize: '13px', cursor: 'pointer' }}
            >
              View all →
            </button>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            {bills.slice(0, 5).map((bill, i) => (
              <div key={i} style={{ 
                padding: '12px 16px', 
                borderBottom: i < Math.min(5, bills.length) - 1 ? '1px solid #E2E8F0' : 'none',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{bill.appLogo}</span>
                  <div>
                    <p style={{ fontWeight: '500', color: '#0F172A', marginBottom: '2px', fontSize: '14px' }}>{bill.app}</p>
                    <p style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>{bill.date}</p>
                  </div>
                </div>
                <span style={{ fontWeight: '600', color: '#059669' }}>₹{bill.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If no transactions */}
      {bills.length === 0 && (
        <div style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 20px' }}>
          <div style={{ background: 'white', padding: '48px', textAlign: 'center', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <p style={{ color: '#64748B', marginBottom: '16px' }}>No transactions yet</p>
            <button
              onClick={() => navigate('/subscriptions')}
              style={{
                padding: '10px 20px',
                background: '#2C7A7B',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              View Subscriptions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;