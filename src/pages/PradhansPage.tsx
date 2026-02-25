import React, { useState, useMemo } from 'react';
import { pindraPanchayats, getHindiVillage } from '../data/pindraPanchayats';
import { colors } from '../utils/colors';

export const PradhansPage = React.memo(function PradhansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'name' | 'village'>('all');

  const filtered = useMemo(() => {
    if (!searchTerm) return pindraPanchayats;

    return pindraPanchayats.filter((pradhan) => {
      const nameMatch = pradhan.name.toLowerCase().includes(searchTerm.toLowerCase());
      const villageMatch = getHindiVillage(pradhan.village)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (filterType === 'name') return nameMatch;
      if (filterType === 'village') return villageMatch;
      return nameMatch || villageMatch;
    });
  }, [searchTerm, filterType]);

  const stats = {
    total: pindraPanchayats.length,
    unique_villages: [...new Set(pindraPanchayats.map(p => p.village))].length,
  };

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          color: colors.neutral.white,
          padding: '32px 16px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>पिण्डरा ब्लॉक के ग्राम प्रधान</h2>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          Pindra Block Gram Pradhan List
        </p>
      </div>

      {/* Stats */}
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div
          style={{
            padding: '16px',
            backgroundColor: colors.primary.light,
            border: `1px solid ${colors.primary.main}`,
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary.dark }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '12px', color: colors.text.secondary }}>कुल ग्राम प्रधान</div>
        </div>
        <div
          style={{
            padding: '16px',
            backgroundColor: colors.accent.light,
            border: `1px solid ${colors.accent.main}`,
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.accent.dark }}>
            {stats.unique_villages}
          </div>
          <div style={{ fontSize: '12px', color: colors.text.secondary }}>कुल गाँव</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.light }}>
        <input
          type="text"
          placeholder="प्रधान का नाम या गाँव खोजें..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
            marginBottom: '12px',
          }}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setFilterType('all')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: filterType === 'all' ? colors.primary.main : colors.neutral.white,
              color: filterType === 'all' ? colors.neutral.white : colors.text.primary,
              border: `1px solid ${filterType === 'all' ? colors.primary.main : colors.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            सभी
          </button>
          <button
            onClick={() => setFilterType('name')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: filterType === 'name' ? colors.primary.main : colors.neutral.white,
              color: filterType === 'name' ? colors.neutral.white : colors.text.primary,
              border: `1px solid ${filterType === 'name' ? colors.primary.main : colors.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            नाम
          </button>
          <button
            onClick={() => setFilterType('village')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: filterType === 'village' ? colors.primary.main : colors.neutral.white,
              color: filterType === 'village' ? colors.neutral.white : colors.text.primary,
              border: `1px solid ${filterType === 'village' ? colors.primary.main : colors.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            गाँव
          </button>
        </div>
      </div>

      {/* Pradhans List */}
      <div style={{ padding: '16px' }}>
        {filtered.length > 0 ? (
          <>
            <div style={{ marginBottom: '12px', fontSize: '12px', color: colors.text.secondary }}>
              {filtered.length} परिणाम मिल रहे हैं
            </div>
            {filtered.map((pradhan, index) => (
              <div
                key={pradhan.id}
                style={{
                  marginBottom: '12px',
                  backgroundColor: colors.neutral.white,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'stretch',
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
                {/* Serial Number */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: colors.primary.light,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: colors.primary.dark,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '600', color: colors.text.primary }}>
                    {pradhan.name}
                  </h3>
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '2px' }}>
                      गाँव:
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: colors.primary.dark }}>
                      {getHindiVillage(pradhan.village)} ({pradhan.village})
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${pradhan.phone}`;
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
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '1';
                    }}
                  >
                    📞 {pradhan.phone}
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: colors.text.secondary }}>
            <p style={{ fontSize: '16px', margin: '0' }}>कोई प्रधान नहीं मिला</p>
            <p style={{ fontSize: '12px', margin: '8px 0 0 0' }}>कृपया अपनी खोज बदलें</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.light, marginTop: '16px' }}>
        <div style={{ fontSize: '12px', color: colors.text.secondary, lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>डेटा स्रोत:</strong> उत्तर प्रदेश पंचायती राज विभाग
          </p>
          <p style={{ margin: 0 }}>
            <strong>अंतिम अपडेट:</strong> Pindra Block के सभी 104 ग्राम प्रधान और उनके संपर्क नंबर
          </p>
        </div>
      </div>
    </div>
  );
});
