import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [updating, setUpdating] = useState(false);
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

  const handleManageClick = (subscription) => {
    setSelectedSub(subscription);
    setShowPlanModal(true);
  };

  const handlePlanChange = async (newPlan, newPrice, billingCycle) => {
    if (!selectedSub) return;
    
    setUpdating(true);
    try {
      await api.updatePlan(selectedSub.id, newPlan, newPrice, billingCycle);
      
      setSubscriptions(subscriptions.map(sub => 
        sub.id === selectedSub.id 
          ? { ...sub, plan: newPlan, price: newPrice, billingCycle }
          : sub
      ));
      
      const paymentInfo = {
        appName: selectedSub.appName,
        appLogo: selectedSub.logo,
        appColor: selectedSub.color,
        oldPlan: selectedSub.plan,
        oldPrice: selectedSub.price,
        oldCycle: selectedSub.billingCycle,
        newPlan: newPlan,
        newPrice: newPrice,
        newCycle: billingCycle,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString(),
        transactionId: `TXN${Date.now().toString().slice(-8)}`,
        invoice: `INV-${selectedSub.appName.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}`
      };
      
      setPaymentDetails(paymentInfo);
      
      const newBill = {
        id: Date.now(),
        app: selectedSub.appName,
        appLogo: selectedSub.logo,
        invoice: paymentInfo.invoice,
        date: paymentInfo.date,
        amount: newPrice,
        billingCycle: billingCycle,
        status: 'Paid'
      };
      
      const existingBills = JSON.parse(localStorage.getItem('bills') || '[]');
      const updatedBills = [newBill, ...existingBills];
      localStorage.setItem('bills', JSON.stringify(updatedBills));
      setBills(updatedBills);
      
      setShowPlanModal(false);
      setSelectedSub(null);
      setShowPaymentPopup(true);
      
    } catch (error) {
      alert('Failed to update plan');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F8FAFC' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#0A2647', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // ✅ Calculate ACTUAL spending from bills (not subscription prices)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Get this month's spending
  const thisMonthBills = bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
  });
  const thisMonthSpent = thisMonthBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Get last month's spending
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthBills = bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate.getMonth() === lastMonth && billDate.getFullYear() === lastMonthYear;
  });
  const lastMonthSpent = lastMonthBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Calculate yearly spending (last 12 months)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(currentYear - 1);
  const yearlyBills = bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate >= oneYearAgo;
  });
  const yearlySpent = yearlyBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Calculate average monthly spend
  const monthsWithData = new Set(bills.map(bill => {
    const d = new Date(bill.date);
    return `${d.getMonth()}-${d.getFullYear()}`;
  })).size;
  const avgMonthly = monthsWithData > 0 ? Math.round(yearlySpent / monthsWithData) : 0;

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '16px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#0A2647' }}>My Subscriptions</h1>
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
              background: tab === 'Subscriptions' ? '#0A2647' : 'transparent',
              color: tab === 'Subscriptions' ? 'white' : '#64748B',
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

      {/* Summary Cards - Now showing ACTUAL spending */}
      <div style={{ maxWidth: '1200px', margin: '32px auto 0', padding: '0 20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>Your Spending Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {/* This Month */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '8px' }}>This Month</p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: '#059669', margin: 0 }}>₹{thisMonthSpent}</p>
            <p style={{ color: '#64748B', fontSize: '11px', marginTop: '4px' }}>
              {thisMonthBills.length} payment{thisMonthBills.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Last Month */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '8px' }}>Last Month</p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: '#D97706', margin: 0 }}>₹{lastMonthSpent}</p>
            <p style={{ color: '#64748B', fontSize: '11px', marginTop: '4px' }}>
              {lastMonthBills.length} payment{lastMonthBills.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Yearly Total */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '8px' }}>Last 12 Months</p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: '#0A2647', margin: 0 }}>₹{yearlySpent}</p>
            <p style={{ color: '#64748B', fontSize: '11px', marginTop: '4px' }}>
              {yearlyBills.length} total payments
            </p>
          </div>

          {/* Monthly Average */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '8px' }}>Monthly Average</p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: '#2C7A7B', margin: 0 }}>₹{avgMonthly}</p>
            <p style={{ color: '#64748B', fontSize: '11px', marginTop: '4px' }}>
              over {monthsWithData} month{monthsWithData !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* All Subscriptions Grid */}
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '20px' }}>Your Subscription Plans</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {subscriptions.map((sub) => (
            <div key={sub.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', background: sub.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '20px', color: 'white' }}>
                  {sub.logo}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>{sub.appName}</h4>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '12px' }}>{sub.category}</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#F8FAFC', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                <div>
                  <p style={{ color: '#64748B', fontSize: '10px', marginBottom: '2px' }}>Plan</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#0F172A', margin: 0 }}>{sub.plan}</p>
                </div>
                <div>
                  <p style={{ color: '#64748B', fontSize: '10px', marginBottom: '2px' }}>Price</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#059669', margin: 0 }}>
                    ₹{sub.price}<span style={{ fontSize: '10px', color: '#64748B', marginLeft: '2px' }}>/{sub.billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleManageClick(sub)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'white',
                  color: '#2C7A7B',
                  border: '1px solid #2C7A7B',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => { e.target.style.background = '#2C7A7B'; e.target.style.color = 'white'; }}
                onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.color = '#2C7A7B'; }}
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Change Modal */}
      {showPlanModal && selectedSub && (
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
        }} onClick={() => !updating && setShowPlanModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }} onClick={(e) => e.stopPropagation()}>
            
            <h3 style={{ marginBottom: '20px' }}>Change Plan - {selectedSub.appName}</h3>
            
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>Current: {selectedSub.plan}</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: selectedSub.color }}>
                ₹{selectedSub.price}/{selectedSub.billingCycle === 'yearly' ? 'year' : 'month'}
              </p>
            </div>

            {selectedSub.availablePlans.map((plan, i) => (
              <button
                key={i}
                onClick={() => handlePlanChange(plan.name, plan.price, plan.billingCycle)}
                disabled={updating || (plan.name === selectedSub.plan && plan.billingCycle === selectedSub.billingCycle)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '8px',
                  background: (plan.name === selectedSub.plan && plan.billingCycle === selectedSub.billingCycle) ? '#F1F5F9' : 'white',
                  border: (plan.name === selectedSub.plan && plan.billingCycle === selectedSub.billingCycle) ? '2px solid #2C7A7B' : '1px solid #E2E8F0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{plan.name}</span>
                <span style={{ fontWeight: '600', color: '#059669' }}>₹{plan.price}/{plan.billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
              </button>
            ))}

            <button
              onClick={() => setShowPlanModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '12px',
                background: 'none',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Payment Success Popup */}
      {showPaymentPopup && paymentDetails && (
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
          zIndex: 2000
        }} onClick={() => setShowPaymentPopup(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '360px',
            width: '90%',
            textAlign: 'center'
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{
              width: '48px',
              height: '48px',
              background: '#059669',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'white',
              fontSize: '24px'
            }}>
              ✓
            </div>

            <h3 style={{ color: '#059669', marginBottom: '8px' }}>Payment Successful!</h3>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>{paymentDetails.appName} plan updated</p>

            <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748B', fontSize: '12px' }}>Old Plan:</span>
                <span style={{ color: '#0F172A', fontWeight: '500', fontSize: '13px' }}>
                  {paymentDetails.oldPlan} (₹{paymentDetails.oldPrice}/{paymentDetails.oldCycle === 'yearly' ? 'yr' : 'mo'})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#64748B', fontSize: '12px' }}>New Plan:</span>
                <span style={{ color: '#059669', fontWeight: '600', fontSize: '13px' }}>
                  {paymentDetails.newPlan} (₹{paymentDetails.newPrice}/{paymentDetails.newCycle === 'yearly' ? 'yr' : 'mo'})
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>ID: {paymentDetails.transactionId}</div>
            </div>

            <button
              onClick={() => setShowPaymentPopup(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#2C7A7B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscriptions;