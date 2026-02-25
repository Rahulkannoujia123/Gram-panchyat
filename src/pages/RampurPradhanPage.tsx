import React from 'react';
import { colors } from '../utils/colors';

export const RampurPradhanPage = React.memo(function RampurPradhanPage() {
  const pradhanData = {
    सर्पंच: "इंदु देवी (Indu Devi)",
    सर्पंच_नाम_अंग्रेजी: "Indu Devi (Also known as Indu)",
    गाँव: "रामपुर (Rampur)",
    पंचायत: "बबतपुर ग्राम पंचायत",
    ब्लॉक: "पिंड्रा",
    जिला: "वाराणसी",
    राज्य: "उत्तर प्रदेश",
    मोबाइल_नंबर_1: "8960463591",
    मोबाइल_नंबर_2: "9651590926",
    ईमेल: "acopindra@gmail.com",
    पद: "ग्राम प्रधान (Gram Pradhan/Sarpanch)",
    कुल_गाँव: 3,
    कुल_वार्ड: 15,
    निर्वाचित_सदस्य: 2,
  };

  const secretary = {
    नाम: "हरिहर (Harihar)",
    पद: "सचिव (Secretary)",
    मोबाइल: "9415990828",
    ईमेल: "adopindra@gmail.com",
  };

  const members = [
    {
      नाम: "प्रेमा देवी (Prema Devi)",
      पद: "ग्राम पंचायत सदस्य (Gram Panchayat Member)",
      मोबाइल: "8081148341",
      ईमेल: "adopindra@gmail.com",
    },
    {
      नाम: "राकेश कुमार (Rakesh Kumar)",
      पद: "ग्राम पंचायत सदस्य (Gram Panchayat Member)",
      मोबाइल: "9721187205",
      ईमेल: "adopindra@gmail.com",
    },
  ];

  const gramPanchayats = [
    { नाम: "रामपुर (Rampur)" },
    { नाम: "बबतपुर (Babatpur)" },
    { नाम: "जमालपुर (Jamalpur)" },
  ];

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Main Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.status.success} 0%, ${colors.status.success}dd 100%)`,
          color: colors.neutral.white,
          padding: '24px 16px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>👩‍💼</div>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>इंदु देवी</h1>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>ग्राम प्रधान (Sarpanch)</p>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.95 }}>रामपुर गाँव, बबतपुर पंचायत, पिंड्रा ब्लॉक</p>
      </div>

      {/* Quick Contact */}
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: colors.neutral.light }}>
        <button
          onClick={() => window.location.href = 'tel:8960463591'}
          style={{
            padding: '12px 16px',
            backgroundColor: colors.status.success,
            color: colors.neutral.white,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '1';
          }}
        >
          📞 8960463591
        </button>
        <button
          onClick={() => window.location.href = 'tel:9651590926'}
          style={{
            padding: '12px 16px',
            backgroundColor: colors.primary.main,
            color: colors.neutral.white,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '1';
          }}
        >
          📱 9651590926
        </button>
      </div>

      {/* Location Details */}
      <div style={{ padding: '16px' }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>स्थान विवरण</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ padding: '12px', backgroundColor: colors.neutral.light, borderRadius: '8px', borderLeft: `4px solid ${colors.primary.main}` }}>
            <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>गाँव</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>रामपुर (Rampur)</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: colors.neutral.light, borderRadius: '8px', borderLeft: `4px solid ${colors.primary.main}` }}>
            <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>ग्राम पंचायत</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>बबतपुर (Babatpur)</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: colors.neutral.light, borderRadius: '8px', borderLeft: `4px solid ${colors.primary.main}` }}>
            <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>ब्लॉक</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>पिंड्रा (Pindra)</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: colors.neutral.light, borderRadius: '8px', borderLeft: `4px solid ${colors.primary.main}` }}>
            <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>जिला</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>वाराणसी (Varanasi)</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: colors.neutral.light, borderRadius: '8px', borderLeft: `4px solid ${colors.primary.main}` }}>
            <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>राज्य</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>उत्तर प्रदेश (Uttar Pradesh)</div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div style={{ padding: '16px' }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>संपर्क जानकारी</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ padding: '12px', backgroundColor: colors.neutral.white, border: `1px solid ${colors.border}`, borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>प्राथमिक मोबाइल</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text.primary }}>8960463591</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: colors.neutral.white, border: `1px solid ${colors.border}`, borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>द्वितीयक मोबाइल</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text.primary }}>9651590926</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: colors.neutral.white, border: `1px solid ${colors.border}`, borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>ईमेल</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text.primary }}>acopindra@gmail.com</div>
          </div>
        </div>
      </div>

      {/* Panchayat Details */}
      <div style={{ padding: '16px' }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>पंचायत विवरण</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div style={{ padding: '16px', backgroundColor: colors.primary.light, border: `1px solid ${colors.primary.main}`, borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary.dark, marginBottom: '4px' }}>3</div>
            <div style={{ fontSize: '12px', color: colors.text.secondary }}>कुल गाँव</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: colors.accent.light, border: `1px solid ${colors.accent.main}`, borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.accent.dark, marginBottom: '4px' }}>15</div>
            <div style={{ fontSize: '12px', color: colors.text.secondary }}>कुल वार्ड</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: colors.status.info, borderRadius: '8px', textAlign: 'center', opacity: 0.9 }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.neutral.white, marginBottom: '4px' }}>2</div>
            <div style={{ fontSize: '12px', color: colors.neutral.white, opacity: 0.9 }}>निर्वाचित सदस्य</div>
          </div>
        </div>
      </div>

      {/* Villages in Panchayat */}
      <div style={{ padding: '16px' }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>पंचायत के गाँव</h2>
        <div style={{ display: 'grid', gap: '8px' }}>
          {gramPanchayats.map((gp, index) => (
            <div
              key={index}
              style={{
                padding: '12px',
                backgroundColor: colors.neutral.light,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderLeft: `4px solid ${colors.primary.main}`,
              }}
            >
              <span style={{ fontSize: '16px' }}>🏘️</span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: colors.text.primary }}>{gp.नाम}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Secretary Details */}
      <div style={{ padding: '16px' }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>सचिव (Secretary)</h2>
        <div
          style={{
            padding: '16px',
            backgroundColor: colors.neutral.white,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            display: 'grid',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>नाम</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>{secretary.नाम}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>पद</div>
            <div style={{ fontSize: '14px', color: colors.text.primary }}>{secretary.पद}</div>
          </div>
          <button
            onClick={() => window.location.href = `tel:${secretary.मोबाइल}`}
            style={{
              padding: '10px 12px',
              backgroundColor: colors.status.info,
              color: colors.neutral.white,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '1';
            }}
          >
            📞 {secretary.मोबाइल}
          </button>
        </div>
      </div>

      {/* Members */}
      <div style={{ padding: '16px' }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>ग्राम पंचायत सदस्य (Members)</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {members.map((member, index) => (
            <div
              key={index}
              style={{
                padding: '16px',
                backgroundColor: colors.neutral.white,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                display: 'grid',
                gap: '8px',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '2px' }}>नाम</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: colors.text.primary }}>{member.नाम}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '2px' }}>पद</div>
                <div style={{ fontSize: '13px', color: colors.text.primary }}>{member.पद}</div>
              </div>
              <button
                onClick={() => window.location.href = `tel:${member.मोबाइल}`}
                style={{
                  padding: '8px 12px',
                  backgroundColor: colors.status.info,
                  color: colors.neutral.white,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '1';
                }}
              >
                📞 {member.मोबाइल}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.light, marginTop: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: colors.text.primary }}>डेटा स्रोत (Data Source)</h3>
        <div style={{ fontSize: '12px', color: colors.text.secondary, lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 6px 0' }}>उत्तर प्रदेश पंचायती राज विभाग (Uttar Pradesh Panchayati Raj Department)</p>
          <p style={{ margin: '0 0 6px 0' }}>भारत निर्वाचन आयोग (Election Commission of India)</p>
          <p style={{ margin: '0 0 6px 0' }}>Local Body Data Database</p>
          <p style={{ margin: 0, fontStyle: 'italic', fontSize: '11px' }}>अंतिम अपडेट: 2025</p>
        </div>
      </div>

      {/* Additional Info */}
      <div style={{ padding: '16px', backgroundColor: colors.primary.light, borderRadius: '8px', margin: '16px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: colors.primary.dark, lineHeight: '1.6' }}>
          <strong>नोट:</strong> यह जानकारी Uttar Pradesh Government के official Panchayati Raj Department website और Election Commission के records से ली गई है। यदि कोई जानकारी गलत है, तो कृपया संबंधित पंचायत कार्यालय से संपर्क करें।
        </p>
      </div>
    </div>
  );
});
