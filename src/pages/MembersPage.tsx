import React, { useState, useMemo } from 'react';
import { membersData } from '../data';
import { colors } from '../utils/colors';
import { Village } from '../types';

interface MembersPageProps {
  selectedVillage: Village | 'All';
}

export const MembersPage = React.memo(function MembersPage({ selectedVillage }: MembersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return membersData.filter((member) => {
      const nameMatch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
      const villageMatch = selectedVillage === 'All'
        || member.village === selectedVillage
        || member.village === 'Constituency';
      return nameMatch && villageMatch;
    });
  }, [searchTerm, selectedVillage]);

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Search */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.light }}>
        <input
          type="text"
          placeholder="सदस्य खोजें..."
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

      {/* Members List */}
      <div style={{ padding: '16px' }}>
        {filtered.length > 0 ? (
          filtered.map((member) => (
            <div
              key={member.id}
              style={{
                marginBottom: '16px',
                backgroundColor: colors.neutral.white,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${colors.shadow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: colors.primary.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  flexShrink: 0,
                }}
              >
                👤
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                  {member.name}
                </h3>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: colors.text.secondary }}>
                  {member.role}
                </p>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: colors.text.secondary }}>
                  वार्ड: {member.ward}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `tel:${member.phone}`;
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: colors.status.info,
                    color: colors.neutral.white,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  📞 {member.phone}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: colors.text.secondary }}>
            <p style={{ fontSize: '16px', margin: '0' }}>कोई सदस्य नहीं मिला</p>
          </div>
        )}
      </div>
    </div>
  );
});
