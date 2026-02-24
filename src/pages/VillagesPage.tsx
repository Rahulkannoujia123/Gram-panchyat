import React, { useState, useMemo } from 'react';
import { Page } from '../types';
import { colors } from '../utils/colors';
import { useVillages } from '../hooks/useVillages';
import { usePradhanData } from '../hooks/usePradhanData';
import { usePopulationData } from '../hooks/usePopulationData';
import { VillageSelector } from '../components/VillageSelector';
import { PradhanCard } from '../components/PradhanCard';

interface VillagesPageProps {
  onNavigate: (page: Page, villageId?: number) => void;
}

export const VillagesPage = React.memo(function VillagesPage({ onNavigate }: VillagesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillageId, setSelectedVillageId] = useState<number | undefined>();
  const { villages: villagesData, loading, error } = useVillages();
  const { pradhan, loading: pradhanLoading } = usePradhanData(selectedVillageId, villagesData.find(v => v.id === selectedVillageId)?.name);
  const { population, loading: popLoading } = usePopulationData(selectedVillageId, villagesData.find(v => v.id === selectedVillageId)?.name);

  const filteredVillages = useMemo(() => {
    return villagesData.filter(village =>
      village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (village.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
  }, [searchTerm]);

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Header Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          color: colors.neutral.white,
          padding: '24px 16px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>प्रेंद्रा के गाँव</h2>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>कुल {villagesData.length} गाँव</p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '16px',
          margin: '16px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          color: '#856404',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{
          padding: '40px 16px',
          textAlign: 'center',
          color: colors.text.secondary,
        }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳</div>
          <p>गाँवों की जानकारी लोड हो रही है...</p>
        </div>
      )}

      {/* Village Selector */}
      {!loading && (
        <div style={{ padding: '16px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: colors.text.primary, display: 'block', marginBottom: '8px' }}>
              गाँव का चयन करें (विस्तृत जानकारी के लिए)
            </label>
            <VillageSelector
              villages={villagesData}
              selectedVillageId={selectedVillageId}
              onSelect={(villageId) => setSelectedVillageId(villageId)}
              placeholder="गाँव चुनें..."
            />
          </div>

          {/* Pradhan Card */}
          {selectedVillageId && (
            <PradhanCard
              pradhan={pradhan}
              population={population}
              loading={pradhanLoading || popLoading}
            />
          )}
        </div>
      )}

      {/* Search Bar */}
      {!loading && (
        <div style={{ padding: '16px', paddingTop: '0' }}>
          <input
            type="text"
            placeholder="गाँव खोजें..."
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
      )}

      {/* Villages Grid */}
      {!loading && (
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {filteredVillages.map((village) => (
            <button
              key={village.id}
              onClick={() => onNavigate('village-detail', village.id)}
              style={{
                padding: '16px',
                backgroundColor: colors.neutral.white,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${colors.shadow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{village.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px', color: colors.primary.main }}>
                {village.name}
              </div>
              <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>
                👥 {village.population.toLocaleString('hi-IN')} लोग
              </div>
              <div style={{ fontSize: '11px', color: colors.text.tertiary }}>
                🏛️ {village.wards} वार्ड
              </div>
            </button>
          ))}
        </div>

          {filteredVillages.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 16px',
                color: colors.text.secondary,
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div>कोई गाँव नहीं मिला</div>
            </div>
          )}
        </div>
      )}

      {/* Village Statistics */}
      {!loading && (
        <div style={{ padding: '16px', paddingTop: '0' }}>
        <h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          सांख्यिकी
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div
            style={{
              padding: '12px',
              backgroundColor: colors.primary.light,
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary.main }}>
              {villagesData.length}
            </div>
            <div style={{ fontSize: '12px', color: colors.text.secondary }}>कुल गाँव</div>
          </div>
          <div
            style={{
              padding: '12px',
              backgroundColor: colors.accent.light,
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.accent.main }}>
              {villagesData.reduce((sum, v) => sum + v.population, 0).toLocaleString('hi-IN')}
            </div>
            <div style={{ fontSize: '12px', color: colors.text.secondary }}>कुल जनसंख्या</div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
});
