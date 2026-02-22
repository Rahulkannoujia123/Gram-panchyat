import React from 'react';
import { emergencyContacts } from '../data';
import { colors } from '../utils/colors';

export const EmergencyPage = React.memo(function EmergencyPage() {
  // Group contacts by category (emergency services, officials, utilities)
  const emergencyServices = emergencyContacts.slice(0, 5);
  const officialContacts = emergencyContacts.slice(5, 7);
  const serviceComplaints = emergencyContacts.slice(7);

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Alert Banner */}
      <div
        style={{
          padding: '16px',
          backgroundColor: colors.status.error,
          color: colors.neutral.white,
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>आपातकाल संपर्क</h2>
        <p style={{ margin: 0, fontSize: '13px' }}>किसी भी आपात स्थिति में तुरंत नीचे दिए गए नंबर पर कॉल करें</p>
      </div>

      {/* Featured Emergency Contacts */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ marginTop: '0', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          सबसे महत्वपूर्ण
        </h3>
        {emergencyServices.map((emergency) => (
          <button
            key={emergency.id}
            onClick={() => window.location.href = `tel:${emergency.number}`}
            style={{
              width: '100%',
              marginBottom: '12px',
              padding: '16px',
              backgroundColor: colors.status.error,
              color: colors.neutral.white,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px rgba(244, 67, 54, 0.4)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{emergency.name}</div>
              </div>
              <span style={{ fontSize: '20px' }}>{emergency.icon}</span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 'bold' }}>
              {emergency.number}
            </div>
          </button>
        ))}
      </div>

      {/* Official Contacts */}
      {officialContacts.length > 0 && (
        <div style={{ padding: '16px', paddingTop: '0' }}>
          <h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            पंचायत अधिकारी
          </h3>
          {officialContacts.map((emergency) => (
            <button
              key={emergency.id}
              onClick={() => window.location.href = `tel:${emergency.number}`}
              style={{
                width: '100%',
                marginBottom: '12px',
                padding: '16px',
                backgroundColor: colors.neutral.white,
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                fontSize: '14px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = colors.primary.main;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${colors.shadow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = colors.border;
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{emergency.name}</div>
                </div>
                <div style={{ fontSize: '16px', marginRight: '8px' }}>{emergency.icon}</div>
                <div style={{ fontWeight: 'bold', color: colors.primary.main }}>
                  {emergency.number}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Service Complaints */}
      {serviceComplaints.length > 0 && (
        <div style={{ padding: '16px', paddingTop: '0' }}>
          <h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            सेवा शिकायत
          </h3>
          {serviceComplaints.map((emergency) => (
            <button
              key={emergency.id}
              onClick={() => window.location.href = `tel:${emergency.number}`}
              style={{
                width: '100%',
                marginBottom: '12px',
                padding: '16px',
                backgroundColor: colors.neutral.white,
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                fontSize: '14px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = colors.primary.main;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${colors.shadow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = colors.border;
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{emergency.name}</div>
                </div>
                <div style={{ fontSize: '16px', marginRight: '8px' }}>{emergency.icon}</div>
                <div style={{ fontWeight: 'bold', color: colors.primary.main }}>
                  {emergency.number}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
