import React from 'react';
import { PradhanData } from '../services/pradhanService';
import { PopulationData } from '../services/populationService';
import { colors } from '../utils/colors';

interface PradhanCardProps {
  pradhan: PradhanData | null;
  population: PopulationData | null;
  loading?: boolean;
}

export const PradhanCard = React.memo(function PradhanCard({
  pradhan,
  population,
  loading = false,
}: PradhanCardProps) {
  if (loading) {
    return (
      <div
        style={{
          padding: '16px',
          backgroundColor: colors.neutral.light,
          borderRadius: '8px',
          marginBottom: '16px',
          textAlign: 'center',
          color: colors.text.secondary,
        }}
      >
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>⏳</div>
        <p>जानकारी लोड हो रही है...</p>
      </div>
    );
  }

  if (!pradhan) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: colors.neutral.light,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Pradhan Info */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '14px', color: colors.text.secondary, marginBottom: '4px' }}>
          सरपंच (Sarpanch)
        </div>
        <div style={{ fontSize: '18px', fontWeight: '600', color: colors.text.primary }}>
          👨‍💼 {pradhan.name}
        </div>
      </div>

      {/* Contact Details */}
      {(pradhan.phone || pradhan.email) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          {pradhan.phone && (
            <div>
              <div style={{ fontSize: '12px', color: colors.text.secondary }}>📱 फोन</div>
              <a
                href={`tel:${pradhan.phone}`}
                style={{
                  fontSize: '14px',
                  color: colors.primary.main,
                  textDecoration: 'none',
                  fontWeight: '500',
                }}
              >
                {pradhan.phone}
              </a>
            </div>
          )}
          {pradhan.email && (
            <div>
              <div style={{ fontSize: '12px', color: colors.text.secondary }}>📧 ईमेल</div>
              <a
                href={`mailto:${pradhan.email}`}
                style={{
                  fontSize: '14px',
                  color: colors.primary.main,
                  textDecoration: 'none',
                  fontWeight: '500',
                }}
              >
                {pradhan.email}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Population Stats */}
      {population && (
        <div>
          <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '8px' }}>
            📊 जनसंख्या (Census {population.year})
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            <div
              style={{
                backgroundColor: colors.background,
                padding: '8px',
                borderRadius: '6px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', color: colors.text.secondary }}>कुल</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: colors.primary.main }}>
                {population.population.toLocaleString('hi-IN')}
              </div>
            </div>
            <div
              style={{
                backgroundColor: colors.background,
                padding: '8px',
                borderRadius: '6px',
              }}
            >
              <div style={{ fontSize: '11px', color: colors.text.secondary }}>
                👨 {population.males.toLocaleString('hi-IN')} | 👩 {population.females.toLocaleString('hi-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Source Info */}
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${colors.border}` }}>
        <div style={{ fontSize: '11px', color: colors.text.secondary }}>
          📌 Source: {pradhan.source === 'api' ? 'Government API' : 'Local Data'}
          {population && ` | Population: ${population.source === 'census-2011' ? 'Census 2011' : 'API'}`}
        </div>
      </div>
    </div>
  );
});
