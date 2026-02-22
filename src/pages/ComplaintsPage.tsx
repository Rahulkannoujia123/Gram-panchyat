import React, { useState, useMemo, useCallback } from 'react';
import { complaintsData } from '../data';
import { colors } from '../utils/colors';
import { Complaint } from '../types';

const complaintCategories = ['सड़क', 'बिजली', 'सफाई', 'पानी', 'अन्य'];

export const ComplaintsPage = React.memo(function ComplaintsPage() {
  const [filter, setFilter] = useState('all');
  const [newComplaint, setNewComplaint] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('सड़क');
  const [localComplaints, setLocalComplaints] = useState(complaintsData);

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: colors.accent.light, text: colors.accent.dark },
    'in-progress': { bg: '#E3F2FD', text: '#1976D2' },
    resolved: { bg: '#F1F8E9', text: '#558B2F' },
  };

  const filtered = useMemo(() => {
    return filter === 'all'
      ? localComplaints
      : localComplaints.filter((c) => c.status === filter);
  }, [filter, localComplaints]);

  const handleSubmit = useCallback(() => {
    if (newComplaint.trim()) {
      const complaint: Complaint = {
        id: Math.max(...localComplaints.map((c) => c.id), 0) + 1,
        title: newComplaint,
        description: newComplaint,
        date: new Date().toLocaleDateString('hi-IN'),
        status: 'pending' as const,
        category: selectedCategory,
        votes: 0,
      };
      setLocalComplaints((prev) => [complaint, ...prev]);
      setNewComplaint('');
    }
  }, [newComplaint, selectedCategory, localComplaints]);

  const handleVote = useCallback(
    (id: number) => {
      setLocalComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, votes: c.votes + 1 } : c))
      );
    },
    []
  );

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Submission Form */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.light, borderRadius: '8px', margin: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
          श्रेणी चुनें:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            boxSizing: 'border-box',
          }}
        >
          {complaintCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <textarea
          value={newComplaint}
          onChange={(e) => setNewComplaint(e.target.value)}
          placeholder="अपनी शिकायत दर्ज करें..."
          style={{
            width: '100%',
            padding: '12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '12px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            minHeight: '100px',
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: colors.primary.main,
            color: colors.neutral.white,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary.dark;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary.main;
          }}
        >
          शिकायत सबमिट करें
        </button>
      </div>

      {/* Filters */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {[
          { id: 'all', label: 'सभी' },
          { id: 'pending', label: 'खुली' },
          { id: 'in-progress', label: 'प्रगति में' },
          { id: 'resolved', label: 'समाधान' },
        ].map((status) => (
          <button
            key={status.id}
            onClick={() => setFilter(status.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: filter === status.id ? colors.primary.main : colors.neutral.light,
              color: filter === status.id ? colors.neutral.white : colors.text.primary,
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '13px',
              fontWeight: filter === status.id ? '600' : '400',
            }}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      <div style={{ padding: '16px' }}>
        {filtered.length > 0 ? (
          filtered.map((complaint) => (
            <div
              key={complaint.id}
              style={{
                marginBottom: '16px',
                backgroundColor: colors.neutral.white,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                padding: '16px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${colors.shadow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                    {complaint.title}
                  </h3>
                  <div style={{ fontSize: '12px', color: colors.text.secondary }}>
                    {complaint.category} • {complaint.date}
                  </div>
                </div>
                <div
                  style={{
                    padding: '6px 12px',
                    backgroundColor: statusColors[complaint.status].bg,
                    color: statusColors[complaint.status].text,
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    marginLeft: '8px',
                  }}
                >
                  {complaint.status}
                </div>
              </div>
              <p style={{ margin: '8px 0', fontSize: '14px', color: colors.text.primary }}>
                {complaint.description}
              </p>
              <button
                onClick={() => handleVote(complaint.id)}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  backgroundColor: colors.primary.light,
                  color: colors.primary.dark,
                  border: `1px solid ${colors.primary.main}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary.main;
                  (e.currentTarget as HTMLElement).style.color = colors.neutral.white;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary.light;
                  (e.currentTarget as HTMLElement).style.color = colors.primary.dark;
                }}
              >
                👍 समर्थन करें ({complaint.votes})
              </button>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: colors.text.secondary }}>
            <p style={{ fontSize: '16px', margin: '0' }}>कोई शिकायत नहीं मिली</p>
          </div>
        )}
      </div>
    </div>
  );
});
