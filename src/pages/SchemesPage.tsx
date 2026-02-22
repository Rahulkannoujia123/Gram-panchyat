import React, { useState, useMemo } from 'react';
import { schemesData } from '../data';
import { colors } from '../utils/colors';

export const SchemesPage = React.memo(function SchemesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return schemesData.filter((scheme) =>
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Search */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.light }}>
        <input
          type="text"
          placeholder="योजनाएं खोजें..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Schemes List */}
      <div style={{ padding: '16px' }}>
        {filtered.length > 0 ? (
          filtered.map((scheme) => (
            <div
              key={scheme.id}
              style={{
                marginBottom: '16px',
                backgroundColor: colors.neutral.white,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${colors.shadow}`;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  padding: '4px 12px',
                  backgroundColor: colors.accent.light,
                  borderBottom: `2px solid ${colors.accent.main}`,
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: colors.accent.dark,
                  }}
                >
                  {scheme.category}
                </span>
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                  {scheme.name}
                </h3>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: colors.text.primary }}>
                  {scheme.description}
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600' }}>लाभ:</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: colors.text.secondary }}>
                    {scheme.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600' }}>पात्रता:</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: colors.text.secondary }}>
                    {scheme.eligibility.map((elig, idx) => (
                      <li key={idx}>{elig}</li>
                    ))}
                  </ul>
                </div>

                {scheme.deadline && (
                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: colors.status.warning,
                      color: colors.neutral.white,
                      borderRadius: '6px',
                      fontSize: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    समय सीमा: {scheme.deadline}
                  </div>
                )}

                <button
                  onClick={() => window.open(scheme.link, '_blank')}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: colors.primary.main,
                    color: colors.neutral.white,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary.dark;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary.main;
                  }}
                >
                  आवेदन करें
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: colors.text.secondary }}>
            <p style={{ fontSize: '16px', margin: '0' }}>कोई योजनाएं नहीं मिलीं</p>
          </div>
        )}
      </div>
    </div>
  );
});
