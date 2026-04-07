import React from 'react';

function SubscriptionCard({ sub, onManageClick }) {
  const brandColors = {
    'Netflix': '#E50914',
    'Spotify': '#1DB954',
    'Amazon Prime': '#00A8E1',
    'Disney+ Hotstar': '#1AA2E6',
    'YouTube Premium': '#FF0000'
  };

  const colors = {
    primary: '#0A2647',
    secondary: '#2C7A7B',
    text: '#0F172A',
    textMuted: '#64748B',
    border: '#E2E8F0',
    success: '#059669'
  };

  const getBrandLogo = (appName) => {
    switch(appName) {
      case 'Netflix': return 'N';
      case 'Spotify': return '♪';
      case 'Amazon Prime': return '📦';
      case 'Disney+ Hotstar': return '✨';
      case 'YouTube Premium': return '▶️';
      default: return sub.logo;
    }
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.borderColor = brandColors[sub.appName] || colors.secondary;
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = colors.border;
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          background: brandColors[sub.appName] || colors.secondary,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          fontSize: '20px',
          color: 'white',
          fontWeight: '600'
        }}>
          {getBrandLogo(sub.appName)}
        </div>
        <div>
          <h3 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: '600', color: colors.text }}>
            {sub.appName}
          </h3>
          <p style={{ margin: 0, color: colors.textMuted, fontSize: '12px' }}>{sub.category}</p>
        </div>
        <span style={{
          marginLeft: 'auto',
          background: '#ECFDF3',
          color: colors.success,
          padding: '2px 8px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '500'
        }}>
          Active
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px',
        background: '#F8FAFC',
        padding: '12px',
        borderRadius: '8px'
      }}>
        <div>
          <p style={{ color: colors.textMuted, fontSize: '10px', marginBottom: '2px' }}>Plan</p>
          <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text, margin: 0 }}>{sub.plan}</p>
        </div>
        <div>
          <p style={{ color: colors.textMuted, fontSize: '10px', marginBottom: '2px' }}>Price</p>
          <p style={{ fontSize: '16px', fontWeight: '600', color: colors.success, margin: 0 }}>
            ₹{sub.price}
            <span style={{ fontSize: '10px', color: colors.textMuted, marginLeft: '2px' }}>
              /{sub.billingCycle === 'yearly' ? 'yr' : 'mo'}
            </span>
          </p>
        </div>
        <div>
          <p style={{ color: colors.textMuted, fontSize: '10px', marginBottom: '2px' }}>Next Bill</p>
          <p style={{ fontSize: '12px', color: colors.text, margin: 0 }}>{sub.nextBilling}</p>
        </div>
        <div>
          <p style={{ color: colors.textMuted, fontSize: '10px', marginBottom: '2px' }}>Devices</p>
          <p style={{ fontSize: '12px', color: colors.text, margin: 0 }}>{sub.devices}</p>
        </div>
      </div>

      <button
        onClick={() => onManageClick(sub)}
        style={{
          width: '100%',
          padding: '10px',
          background: 'white',
          color: colors.secondary,
          border: `1px solid ${colors.secondary}`,
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.target.style.background = colors.secondary;
          e.target.style.color = 'white';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'white';
          e.target.style.color = colors.secondary;
        }}
      >
        Manage
      </button>
    </div>
  );
}

export default SubscriptionCard;