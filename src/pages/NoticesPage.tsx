import React, { useMemo } from 'react';
import { noticesData } from '../data';
import { colors } from '../utils/colors';

export const NoticesPage = React.memo(function NoticesPage() {
  const priorityColors: Record<string, { bg: string; text: string; icon: string }> = {
    high: { bg: colors.status.error, text: colors.neutral.white, icon: '🔴' },
    normal: { bg: colors.neutral.light, text: colors.text.primary, icon: '🟡' },
    low: { bg: colors.primary.light, text: colors.primary.dark, icon: '🟢' },
  };

  const sortedNotices = useMemo(() => {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    return [...noticesData].sort(
      (a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
    );
  }, []);

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Info Banner */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.light }}>
        <p style={{ margin: 0, fontSize: '13px', color: colors.text.secondary }}>
          महत्वपूर्ण सूचनाएं और घोषणाएं यहाँ दिखाई देती हैं
        </p>
      </div>

      {/* Notices List */}
      <div style={{ padding: '16px' }}>
        {sortedNotices.map((notice) => {
          const colors_priority = priorityColors[notice.priority as keyof typeof priorityColors];

          return (
            <div
              key={notice.id}
              style={{
                marginBottom: '16px',
                backgroundColor: colors.neutral.white,
                border: `2px solid ${colors_priority.bg}`,
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
              {/* Header */}
              <div style={{ padding: '12px 16px', backgroundColor: colors_priority.bg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{colors_priority.icon}</span>
                  <span style={{ color: colors_priority.text, fontSize: '12px', fontWeight: '600' }}>
                    {notice.priority === 'high' ? 'अत्यधिक महत्वपूर्ण' : notice.priority === 'normal' ? 'सामान्य' : 'कम प्राथमिकता'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                  {notice.title}
                </h3>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: colors.text.primary, lineHeight: '1.5' }}>
                  {notice.content}
                </p>
                <div style={{ fontSize: '12px', color: colors.text.secondary }}>
                  📅 {notice.date}
                </div>
              </div>

              {/* Action */}
              <div style={{ padding: '0 16px 16px 16px' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: colors_priority.bg,
                    color: colors_priority.text,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (notice.priority === 'high') {
                      (e.currentTarget as HTMLElement).style.backgroundColor = colors.status.error;
                    }
                  }}
                >
                  और जानें
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
