import React, { useState, useMemo, useEffect } from 'react';
import { colors } from '../utils/colors';
import { schemeService } from '../services/schemeService';
import { Scheme } from '../types';

const categories = ['सभी', 'कृषि', 'आवास', 'स्वास्थ्य', 'रोजगार', 'शिक्षा', 'स्वच्छता'];

export const SchemesPage = React.memo(function SchemesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('सभी');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      const data = await schemeService.getSchemes(selectedCategory);
      setSchemes(data);
      setLoading(false);
    };
    fetchSchemes();
  }, [selectedCategory]);

  const filtered = useMemo(() => {
    return schemes.filter((scheme) =>
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, schemes]);

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Search & Categories */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.light, position: 'sticky', top: 0, zIndex: 10 }}>
        <input
          type="text"
          placeholder="योजनाएं खोजें..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: `2px solid ${colors.primary.main}`,
            borderRadius: '12px',
            fontSize: '14px',
            boxSizing: 'border-box',
            marginBottom: '12px',
            boxShadow: `0 2px 8px ${colors.shadow}`
          }}
        />
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: selectedCategory === cat ? colors.primary.main : colors.neutral.white,
                color: selectedCategory === cat ? colors.neutral.white : colors.text.primary,
                fontSize: '13px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: `0 1px 3px ${colors.shadow}`
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', backgroundColor: colors.primary.light, margin: '16px', borderRadius: '12px', border: `1px solid ${colors.primary.main}` }}>
        <p style={{ margin: 0, fontSize: '13px', color: colors.primary.dark, lineHeight: '1.5' }}>
          <strong>हमारा विजन:</strong> पिण्डरा के हर नागरिक तक सरकारी योजनाओं की जानकारी सही समय पर पहुंचाना ताकि उनका जीवन आसान हो सके।
        </p>
      </div>

      {/* Schemes List */}
      <div style={{ padding: '16px', paddingTop: 0 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>लोड हो रहा है...</div>
        ) : filtered.length > 0 ? (
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

                <a
                  href={scheme.link || "https://www.myscheme.gov.in/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    backgroundColor: colors.primary.main,
                    color: colors.neutral.white,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  आधिकारिक वेबसाइट पर देखें
                </a>
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
