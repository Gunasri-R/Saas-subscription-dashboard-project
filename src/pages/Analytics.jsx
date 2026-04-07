import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Analytics() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showMonthDetails, setShowMonthDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const localBills = JSON.parse(localStorage.getItem('bills') || '[]');
    setBills(localBills);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Prepare monthly data based on selected period
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const periods = {
    '3months': 3,
    '6months': 6,
    '12months': 12
  };
  
  const monthsToShow = periods[selectedPeriod] || 12;
  
  // Generate monthly data
  const monthlyData = [];
  const monthlyLabels = [];
  const monthlyFullLabels = [];
  const monthlyTransactions = [];
  
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    const label = `${monthName} ${year}`;
    const fullLabel = `${fullMonths[d.getMonth()]} ${year}`;
    
    const monthBills = bills.filter(bill => {
      const billDate = new Date(bill.date);
      return billDate.getMonth() === d.getMonth() && billDate.getFullYear() === d.getFullYear();
    });
    
    const monthTotal = monthBills.reduce((sum, bill) => sum + bill.amount, 0);
    
    monthlyData.push(monthTotal);
    monthlyLabels.push(label);
    monthlyFullLabels.push(fullLabel);
    monthlyTransactions.push(monthBills);
  }

  // Calculate statistics
  const totalSpent = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const maxValue = Math.max(...monthlyData, 1);
  
  // Calculate this month vs last month
  const thisMonthTotal = monthlyData[monthsToShow - 1] || 0;
  const lastMonthTotal = monthlyData[monthsToShow - 2] || 0;
  const monthOverMonthChange = lastMonthTotal > 0 
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
    : 0;

  // Calculate average
  const monthsWithData = monthlyData.filter(v => v > 0).length;
  const averageSpend = monthsWithData > 0 
    ? Math.round(monthlyData.reduce((a, b) => a + b, 0) / monthsWithData)
    : 0;

  // Find peak month
  const peakValue = Math.max(...monthlyData);
  const peakIndex = monthlyData.indexOf(peakValue);
  const peakMonth = peakIndex >= 0 ? monthlyLabels[peakIndex] : 'N/A';

  const handleMonthClick = (index) => {
    if (monthlyData[index] > 0) {
      setSelectedMonth({
        label: monthlyFullLabels[index],
        amount: monthlyData[index],
        transactions: monthlyTransactions[index],
        index: index
      });
      setShowMonthDetails(true);
    }
  };

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
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#0A2647' }}>Analytics</h1>
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
              background: tab === 'Analytics' ? '#0A2647' : 'transparent',
              color: tab === 'Analytics' ? 'white' : '#64748B',
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

      {/* Period Selector */}
      <div style={{ maxWidth: '1200px', margin: '32px auto 0', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', margin: 0 }}>Spending Analytics</h2>
        <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '4px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          {['3months', '6months', '12months'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                padding: '6px 12px',
                background: selectedPeriod === period ? '#0A2647' : 'transparent',
                color: selectedPeriod === period ? 'white' : '#64748B',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {period === '3months' ? '3M' : period === '6months' ? '6M' : '12M'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ maxWidth: '1200px', margin: '24px auto 0', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '8px' }}>Total Spent</p>
          <p style={{ fontSize: '28px', fontWeight: '600', color: '#0A2647', margin: 0 }}>₹{totalSpent}</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '8px' }}>Monthly Avg</p>
          <p style={{ fontSize: '28px', fontWeight: '600', color: '#2C7A7B', margin: 0 }}>₹{averageSpend}</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '8px' }}>Peak Month</p>
          <p style={{ fontSize: '20px', fontWeight: '600', color: '#D97706', margin: '0 0 4px' }}>{peakMonth}</p>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#D97706', margin: 0 }}>₹{peakValue}</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '8px' }}>vs Last Month</p>
          <p style={{ fontSize: '28px', fontWeight: '600', color: monthOverMonthChange >= 0 ? '#059669' : '#DC2626', margin: 0 }}>
            {monthOverMonthChange > 0 ? '+' : ''}{monthOverMonthChange}%
          </p>
        </div>
      </div>

      {/* Chart Card */}
      <div style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', margin: 0 }}>
              Monthly Spending Trend
            </h3>
            {bills.length > 0 && (
              <div style={{ fontSize: '13px', color: '#64748B' }}>
                <span style={{ color: '#059669', fontWeight: '600' }}>{monthsWithData}</span> months with data
              </div>
            )}
          </div>

          {bills.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#F8FAFC', borderRadius: '8px' }}>
              <p style={{ color: '#64748B' }}>No transaction data available</p>
              <button
                onClick={() => navigate('/subscriptions')}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: '#2C7A7B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Make your first payment
              </button>
            </div>
          ) : (
            <>
              {/* Bar Chart */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-end', 
                height: '250px',
                gap: '8px',
                marginBottom: '20px'
              }}>
                {monthlyData.map((value, index) => (
                  <div key={index} style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {/* Bar Container */}
                    <div style={{
                      width: '100%',
                      position: 'relative',
                      height: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end'
                    }}>
                      {/* Bar */}
                      <div
                        onClick={() => handleMonthClick(index)}
                        style={{
                          width: '100%',
                          height: `${(value / maxValue) * 180}px`,
                          background: value > 0 
                            ? 'linear-gradient(180deg, #0A2647 0%, #2C7A7B 100%)' 
                            : '#E2E8F0',
                          borderRadius: '6px 6px 0 0',
                          cursor: value > 0 ? 'pointer' : 'default',
                          transition: 'all 0.2s',
                          position: 'relative',
                          opacity: value > 0 ? 1 : 0.5,
                          border: value > 0 ? 'none' : '1px dashed #CBD5E0'
                        }}
                        onMouseOver={(e) => {
                          if (value > 0) {
                            e.target.style.transform = 'scaleY(1.05)';
                            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (value > 0) {
                            e.target.style.transform = 'scaleY(1)';
                            e.target.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {/* Tooltip */}
                        {value > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: '-25px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#0A2647',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none'
                          }} className="tooltip">
                            ₹{value}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Month Label */}
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ 
                        fontSize: '11px',
                        color: value > 0 ? '#0A2647' : '#94A3B8',
                        fontWeight: value > 0 ? '500' : '400',
                        display: 'block',
                        marginBottom: '2px'
                      }}>
                        {monthlyLabels[index]}
                      </span>
                      {value > 0 ? (
                        <span style={{ 
                          fontSize: '9px',
                          background: '#E6F7F0',
                          color: '#059669',
                          padding: '2px 4px',
                          borderRadius: '4px'
                        }}>
                          paid
                        </span>
                      ) : (
                        <span style={{ 
                          fontSize: '9px',
                          color: '#94A3B8'
                        }}>
                          no payment
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '24px', 
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #E2E8F0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#0A2647', borderRadius: '2px' }} />
                  <span style={{ fontSize: '12px', color: '#64748B' }}>With payments</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#E2E8F0', border: '1px dashed #94A3B8', borderRadius: '2px' }} />
                  <span style={{ fontSize: '12px', color: '#64748B' }}>No payments</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#2C7A7B' }}>👆 Click bars for details</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {bills.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 40px', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {/* Total Transactions */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: '#EEF2F6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              📄
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Total Transactions</p>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#0F172A', margin: 0 }}>{bills.length}</p>
            </div>
          </div>

          {/* Active Months */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: '#EEF2F6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              📅
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Active Months</p>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#0F172A', margin: 0 }}>{monthsWithData}</p>
            </div>
          </div>

          {/* Highest Month */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: '#EEF2F6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              🏆
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Highest Month</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', margin: '0 0 2px' }}>{peakMonth}</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#D97706', margin: 0 }}>₹{peakValue}</p>
            </div>
          </div>
        </div>
      )}

      {/* Month Details Modal */}
      {showMonthDetails && selectedMonth && (
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
        }} onClick={() => setShowMonthDetails(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '360px',
            width: '90%'
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', margin: 0 }}>
                {selectedMonth.label}
              </h3>
              <button
                onClick={() => setShowMonthDetails(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
              <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Total Spent</p>
              <p style={{ fontSize: '32px', fontWeight: '600', color: '#059669', margin: 0 }}>₹{selectedMonth.amount}</p>
              <p style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>
                {selectedMonth.transactions.length} transaction{selectedMonth.transactions.length !== 1 ? 's' : ''}
              </p>
            </div>

            {selectedMonth.transactions.length > 0 && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A', marginBottom: '12px' }}>Transactions</h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {selectedMonth.transactions.map((tx, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: i < selectedMonth.transactions.length - 1 ? '1px solid #E2E8F0' : 'none'
                    }}>
                      <div>
                        <span style={{ fontSize: '16px', marginRight: '8px' }}>{tx.appLogo}</span>
                        <span style={{ fontSize: '14px', color: '#0F172A' }}>{tx.app}</span>
                      </div>
                      <span style={{ fontWeight: '600', color: '#059669' }}>₹{tx.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowMonthDetails(false)}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '20px',
                background: '#2C7A7B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;