import React, { useState, useMemo } from 'react';
import { newsData } from '../data';
import { colors } from '../utils/colors';
import { NewsItem, Village } from '../types';

interface NewsPageProps {
  selectedVillage: Village | 'All';
}

export const NewsPage = React.memo(function NewsPage({ selectedVillage }: NewsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('सभी');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['सभी', 'स्वास्थ्य', 'शिक्षा', 'कृषि', 'बुनियादी ढांचा'];

  const filtered = useMemo(() => {
    return newsData.filter((news) => {
      const categoryMatch = selectedCategory === 'सभी' || news.category === selectedCategory;
      const searchMatch = news.title.toLowerCase().includes(searchTerm.toLowerCase());
      const villageMatch = selectedVillage === 'All' || news.village === selectedVillage;
      return categoryMatch && searchMatch && villageMatch;
    });
  }, [selectedCategory, searchTerm, selectedVillage]);

  const groupedNews = useMemo(() => {
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const now = new Date();
    // Consider news from last 48 hours as "New"
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    return {
      newNews: sorted.filter((news) => new Date(news.timestamp) >= twoDaysAgo),
      oldNews: sorted.filter((news) => new Date(news.timestamp) < twoDaysAgo),
    };
  }, [filtered]);

  const renderNewsCard = (news: NewsItem) => (
    <div
      key={news.id}
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
      <div style={{ padding: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '8px',
          }}
        >
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
              {news.title}
            </h3>
            <div style={{ fontSize: '12px', color: colors.text.secondary }}>
              {news.category} • {news.date}
            </div>
          </div>
          <span
            style={{
              padding: '4px 12px',
              backgroundColor: colors.primary.light,
              color: colors.primary.dark,
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600',
              marginLeft: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            {news.category}
          </span>
        </div>
        <p style={{ margin: '8px 0', fontSize: '14px', color: colors.text.primary }}>
          {news.content.substring(0, 100)}...
        </p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: colors.text.secondary,
            }}
          >
            👍 {news.likes}
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: colors.text.secondary,
            }}
          >
            💬 टिप्पणी
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: colors.text.secondary,
            }}
          >
            📤 साझा करें
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Search */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.light }}>
        <input
          type="text"
          placeholder="खबरें खोजें..."
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

      {/* Categories */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedCategory === cat ? colors.primary.main : colors.neutral.light,
              color: selectedCategory === cat ? colors.neutral.white : colors.text.primary,
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              fontSize: '13px',
              fontWeight: selectedCategory === cat ? '600' : '400',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News List */}
      <div style={{ padding: '16px' }}>
        {filtered.length > 0 ? (
          <>
            {groupedNews.newNews.length > 0 && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: colors.primary.dark }}>
                  नई खबरें
                </h2>
                {groupedNews.newNews.map(renderNewsCard)}
              </>
            )}

            {groupedNews.oldNews.length > 0 && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', marginTop: '24px', color: colors.text.secondary }}>
                  पुरानी खबरें
                </h2>
                {groupedNews.oldNews.map(renderNewsCard)}
              </>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: colors.text.secondary }}>
            <p style={{ fontSize: '16px', margin: '0' }}>कोई खबरें नहीं मिलीं</p>
          </div>
        )}
      </div>
    </div>
  );
});
