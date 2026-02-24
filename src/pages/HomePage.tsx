import React, { useMemo } from 'react';
import { Page, Village } from '../types';
import { colors } from '../utils/colors';
import { newsData, complaintsData, membersData } from '../data';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  selectedVillage: Village | 'All';
}

export const HomePage = React.memo(function HomePage({ onNavigate, selectedVillage }: HomePageProps) {
  const villageDisplayName = useMemo(() => {
    if (selectedVillage === 'All') return 'सभी गांव';
    return selectedVillage.hindiName || selectedVillage.name;
  }, [selectedVillage]);

  const filteredNews = useMemo(() => {
    return selectedVillage === 'All'
      ? newsData
      : newsData.filter(n => n.village.id === selectedVillage.id);
  }, [selectedVillage]);

  const filteredComplaints = useMemo(() => {
    return selectedVillage === 'All'
      ? complaintsData
      : complaintsData.filter(c => c.village.id === selectedVillage.id);
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
    { label: 'सदस्य', count: membersData.filter(m => {
      if (selectedVillage === 'All') return true;
      if (m.village === 'Constituency') return true;
      return m.village.id === selectedVillage.id;
    }).length, page: 'members' as Page },
  ];

  const categories = [
    { icon: '📰', label: 'खबरें', page: 'news' as Page },
    { icon: '📝', label: 'शिकायतें', page: 'complaints' as Page },
    { icon: '💼', label: 'योजनाएं', page: 'schemes' as Page },
    { icon: '👥', label: 'सदस्य', page: 'members' as Page },
    { icon: '🏘️', label: 'गाँव', page: 'villages' as Page },
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
          {selectedVillage === 'All' ? 'संपूर्ण विधानसभा की प्रगति' : `${villageDisplayName} ग्राम की प्रगति`}
        </p>
      </div>

      {/* Constituency Level Info - Improved Design */}
      {selectedVillage === 'All' && (
        <div style={{
          margin: '16px',
          backgroundColor: colors.neutral.white,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: `0 4px 15px ${colors.shadow}`,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{
            backgroundColor: colors.primary.main,
            color: colors.neutral.white,
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'inline-block',
            borderBottomRightRadius: '12px'
          }}>
            क्षेत्रीय विधायक
          </div>
          <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: colors.primary.light,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              👨‍💼
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.text.primary }}>डॉ. अवधेश सिंह</div>
              <div style={{ fontSize: '13px', color: colors.text.secondary, marginBottom: '8px' }}>पिण्डरा विधानसभा, वाराणसी</div>
              <a
                href="tel:9415200000"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: colors.primary.light,
                  color: colors.primary.dark,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                📞 संपर्क करें
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar - Advance Feature */}
      <div style={{ padding: '16px', marginTop: '-20px' }}>
        <div style={{
          backgroundColor: colors.neutral.white,
          borderRadius: '12px',
          padding: '4px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: `0 4px 12px ${colors.shadow}`,
          border: `1px solid ${colors.border}`
        }}>
          <span style={{ fontSize: '18px' }}>🔍</span>
          <input
            type="text"
            placeholder="योजनाएं, खबरें या गाँव खोजें..."
            style={{
              border: 'none',
              outline: 'none',
              padding: '12px 0',
              width: '100%',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

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

      {/* Services Section - Advance/Modern look */}
      <div style={{ padding: '16px', paddingTop: '0' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: colors.text.primary }}>
            मुख्य सेवाएं
          </h3>
          <button
            onClick={() => onNavigate('villages')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.primary.main,
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            सभी देखें ›
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 12px' }}>
          {categories.slice(0, 8).map((cat) => (
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
                fontSize: '11px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                width: '100%',
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: colors.neutral.white,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: `0 2px 6px ${colors.shadow}`,
                border: `1px solid ${colors.border}`
              }}>
                {cat.icon}
              </div>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vision & Benefits Card */}
      <div style={{ padding: '16px', paddingTop: '0' }}>
        <div style={{
          background: 'linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid #FBC02D',
          boxShadow: `0 4px 10px ${colors.shadow}`
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#F57F17' }}>🌟 हमारा विजन</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#5D4037', lineHeight: '1.6' }}>
            पिण्डरा के हर गाँव को डिजिटल बनाना। इस ऐप के माध्यम से आप अपनी समस्याओं का समाधान पा सकते हैं और सरकारी योजनाओं का लाभ सीधे उठा सकते हैं।
          </p>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>⚡ तेज समाधान</div>
            <div style={{ backgroundColor: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>📱 आसान पहुंच</div>
            <button
              onClick={() => onNavigate('complaints')}
              style={{
                backgroundColor: colors.primary.main,
                color: 'white',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              🔍 शिकायत ट्रैक करें
            </button>
          </div>
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
