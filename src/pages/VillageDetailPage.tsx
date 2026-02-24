import React, { useMemo } from 'react';
import { colors } from '../utils/colors';
import { villagesData, villageNewsData, villageComplaintsData, villageNoticesData } from '../data';

interface VillageDetailPageProps {
  villageId: number | undefined;
  onNavigate: (section: 'news' | 'complaints' | 'notices') => void;
}

export const VillageDetailPage = React.memo(function VillageDetailPage({
  villageId,
  onNavigate,
}: VillageDetailPageProps) {
  const village = useMemo(() => {
    return villagesData.find(v => v.id === villageId);
  }, [villageId]);

  const villageNews = useMemo(() => {
    return villageNewsData.filter(n => n.villageId === villageId);
  }, [villageId]);

  const villageComplaints = useMemo(() => {
    return villageComplaintsData.filter(c => c.villageId === villageId);
  }, [villageId]);

  const villageNotices = useMemo(() => {
    return villageNoticesData.filter(n => n.villageId === villageId);
  }, [villageId]);

  if (!village) {
    return (
      <div style={{ padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <div>गाँव नहीं मिला</div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Village Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          color: colors.neutral.white,
          padding: '24px 16px',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{village.icon}</div>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '28px' }}>{village.name}</h2>
        <p style={{ margin: '0', fontSize: '13px', opacity: 0.9 }}>{village.description}</p>
      </div>

      {/* Village Info Cards */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.light }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div
            style={{
              padding: '12px',
              backgroundColor: colors.neutral.white,
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
            }}
          >
            <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>
              जनसंख्या
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.primary.main }}>
              {village.population.toLocaleString('hi-IN')}
            </div>
          </div>
          <div
            style={{
              padding: '12px',
              backgroundColor: colors.neutral.white,
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
            }}
          >
            <div style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '4px' }}>
              वार्ड्स
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.accent.main }}>
              {village.wards}
            </div>
          </div>
        </div>
      </div>

      {/* Sarpanch Info */}
      <div style={{ padding: '16px' }}>
        <div
          style={{
            padding: '16px',
            backgroundColor: colors.neutral.white,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            👨‍💼 सरपंच
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
            {village.sarpanch}
          </div>
          <div style={{ fontSize: '13px', color: colors.text.secondary }}>
            📞 {village.phone}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ padding: '16px', paddingTop: '0' }}>
        <h3 style={{ marginTop: '0', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          संक्षिप्त सारांश
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <button
            onClick={() => onNavigate('news')}
            style={{
              padding: '12px',
              backgroundColor: colors.neutral.white,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 8px ${colors.shadow}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>📰</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: colors.primary.main }}>
              {villageNews.length}
            </div>
            <div style={{ fontSize: '11px', color: colors.text.secondary }}>खबरें</div>
          </button>
          <button
            onClick={() => onNavigate('complaints')}
            style={{
              padding: '12px',
              backgroundColor: colors.neutral.white,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 8px ${colors.shadow}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>📝</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: colors.accent.main }}>
              {villageComplaints.length}
            </div>
            <div style={{ fontSize: '11px', color: colors.text.secondary }}>शिकायतें</div>
          </button>
          <button
            onClick={() => onNavigate('notices')}
            style={{
              padding: '12px',
              backgroundColor: colors.neutral.white,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 8px ${colors.shadow}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>📢</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: colors.primary.main }}>
              {villageNotices.length}
            </div>
            <div style={{ fontSize: '11px', color: colors.text.secondary }}>नोटिस</div>
          </button>
        </div>
      </div>

      {/* Village News Section */}
      <div style={{ padding: '16px', paddingTop: '0' }}>
        <h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          हाल की खबरें
        </h3>
        {villageNews.length > 0 ? (
          villageNews.map((news) => (
            <div
              key={news.id}
              style={{
                padding: '12px',
                backgroundColor: colors.neutral.white,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                marginBottom: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 8px ${colors.shadow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>{news.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                    {news.title}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.text.secondary }}>
                    {news.date}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              padding: '16px',
              backgroundColor: colors.neutral.light,
              borderRadius: '8px',
              textAlign: 'center',
              color: colors.text.secondary,
            }}
          >
            कोई खबर नहीं
          </div>
        )}
      </div>

      {/* Village Complaints Section */}
      <div style={{ padding: '16px', paddingTop: '0' }}>
        <h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          शिकायतें ({villageComplaints.filter(c => c.status !== 'resolved').length} खुली)
        </h3>
        {villageComplaints.length > 0 ? (
          villageComplaints.map((complaint) => {
            const statusColor =
              complaint.status === 'resolved'
                ? colors.success
                : complaint.status === 'in-progress'
                ? colors.primary.main
                : colors.accent.main;

            return (
              <div
                key={complaint.id}
                style={{
                  padding: '12px',
                  backgroundColor: colors.neutral.white,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{complaint.title}</div>
                  <div
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      backgroundColor: statusColor,
                      color: colors.neutral.white,
                      borderRadius: '4px',
                    }}
                  >
                    {complaint.status === 'resolved' ? 'समाधान' : complaint.status === 'in-progress' ? 'चल रहा है' : 'लंबित'}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: colors.text.secondary }}>
                  👤 {complaint.userName} • 👍 {complaint.votes}
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              padding: '16px',
              backgroundColor: colors.neutral.light,
              borderRadius: '8px',
              textAlign: 'center',
              color: colors.text.secondary,
            }}
          >
            कोई शिकायत नहीं
          </div>
        )}
      </div>

      {/* Village Notices Section */}
      <div style={{ padding: '16px', paddingTop: '0' }}>
        <h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          नोटिस
        </h3>
        {villageNotices.length > 0 ? (
          villageNotices.map((notice) => {
            const priorityColor =
              notice.priority === 'high'
                ? colors.accent.main
                : notice.priority === 'medium'
                ? colors.primary.main
                : colors.text.secondary;

            return (
              <div
                key={notice.id}
                style={{
                  padding: '12px',
                  backgroundColor: colors.neutral.white,
                  border: `2px solid ${priorityColor}`,
                  borderRadius: '8px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                  {notice.title}
                </div>
                <div style={{ fontSize: '13px', color: colors.text.secondary, marginBottom: '4px', lineHeight: '1.4' }}>
                  {notice.content}
                </div>
                <div style={{ fontSize: '11px', color: colors.text.tertiary }}>
                  {notice.date} • {notice.author}
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              padding: '16px',
              backgroundColor: colors.neutral.light,
              borderRadius: '8px',
              textAlign: 'center',
              color: colors.text.secondary,
            }}
          >
            कोई नोटिस नहीं
          </div>
        )}
      </div>
    </div>
  );
});
