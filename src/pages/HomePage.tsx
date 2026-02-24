import React, { useMemo } from 'react';
import { Page, Village } from '../types';
import { colors } from '../utils/colors';
import { newsData, complaintsData, membersData } from '../data';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  selectedVillage: Village | 'All';
}

export const HomePage = React.memo(function HomePage({ onNavigate, selectedVillage }: HomePageProps) {
  const filteredNews = useMemo(() => {
    return selectedVillage === 'All'
      ? newsData
      : newsData.filter(n => n.village === selectedVillage);
  }, [selectedVillage]);

  const filteredComplaints = useMemo(() => {
    return selectedVillage === 'All'
      ? complaintsData
      : complaintsData.filter(c => c.village === selectedVillage);
  }, [selectedVillage]);

  const unreadNews = useMemo(() => {
    return [...filteredNews]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);
  }, [filteredNews]);

  const openComplaints = useMemo(() => filteredComplaints.filter(c => c.status === 'pending'), [filteredComplaints]);

  const statCards = [
    { label: 'खबरें', count: filteredNews.length, page: 'news' as Page },
    { label: 'शिकायतें', count: filteredComplaints.length, page: 'complaints' as Page },
    { label: 'योजनाएं', count: 6, page: 'schemes' as Page },
    { label: 'सदस्य', count: membersData.filter(m => selectedVillage === 'All' || m.village === selectedVillage || m.village === 'Constituency').length, page: 'members' as Page },
  ];

  const categories = [
    { icon: '📰', label: 'खबरें', page: 'news' as Page },
    { icon: '📝', label: 'शिकायतें', page: 'complaints' as Page },
    { icon: '💼', label: 'योजनाएं', page: 'schemes' as Page },
    { icon: '👥', label: 'सदस्य', page: 'members' as Page },
    { icon: '⚠️', label: 'आपातकाल', page: 'emergency' as Page },
    { icon: '🗳️', label: 'मतदान', page: 'polls' as Page },
    { icon: '📢', label: 'नोटिस', page: 'notices' as Page },
    { icon: '🔔', label: 'सूचनाएं', page: 'notifications' as Page },
    { icon: '👤', label: 'प्रोफाइल', page: 'profile' as Page },
  ];

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          color: colors.neutral.white,
          padding: '32px 16px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>पिण्डरा विधानसभा</h2>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          {selectedVillage === 'All' ? 'संपूर्ण विधानसभा की प्रगति' : `${selectedVillage} ग्राम की प्रगति`}
        </p>
      </div>

      {/* Constituency Level Info */}
      {selectedVillage === 'All' && (
        <div style={{ padding: '16px', backgroundColor: colors.primary.light, margin: '16px', borderRadius: '12px', border: `1px solid ${colors.primary.main}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '40px' }}>🏛️</div>
            <div>
              <div style={{ fontSize: '14px', color: colors.primary.dark, fontWeight: '600' }}>विधायक संपर्क</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>डॉ. अवधेश सिंह</div>
              <div style={{ fontSize: '12px', color: colors.text.secondary }}>पिण्डरा विधानसभा, वाराणसी</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {statCards.map((stat) => (
          <button
            key={stat.label}
            onClick={() => onNavigate(stat.page)}
            style={{
              padding: '16px',
              backgroundColor: colors.neutral.white,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
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
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {stat.label === 'खबरें' ? '📰' : stat.label === 'शिकायतें' ? '📝' : stat.label === 'योजनाएं' ? '💼' : '👥'}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary.main }}>
              {stat.count}
            </div>
            <div style={{ fontSize: '12px', color: colors.text.secondary }}>{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Quick Access */}
      <div style={{ padding: '16px', paddingTop: '0' }}>
        <h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          जल्दी पहुंचें
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => onNavigate(cat.page)}
              style={{
                padding: '12px',
                backgroundColor: colors.neutral.light,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary.light;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = colors.neutral.light;
              }}
            >
              <span style={{ fontSize: '24px' }}>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Latest News */}
      <div style={{ padding: '16px', paddingTop: '0' }}>
        <h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          हाल की खबरें
        </h3>
        {unreadNews.map((news) => (
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
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{news.title}</div>
            <div style={{ fontSize: '12px', color: colors.text.secondary }}>{news.date}</div>
          </div>
        ))}
      </div>

      {/* Open Complaints */}
      {openComplaints.length > 0 && (
        <div style={{ padding: '16px', paddingTop: '0' }}>
          <h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            खुली शिकायतें ({openComplaints.length})
          </h3>
          <div
            style={{
              padding: '12px',
              backgroundColor: colors.accent.light,
              border: `1px solid ${colors.accent.main}`,
              borderRadius: '8px',
              color: colors.accent.dark,
              fontSize: '14px',
            }}
          >
            {openComplaints.length} शिकायतें समाधान के लिए प्रतीक्षारत हैं। अधिक जानकारी के लिए शिकायत खंड में जाएं।
          </div>
        </div>
      )}
    </div>
  );
});
