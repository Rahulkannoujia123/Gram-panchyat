import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { colors } from '../utils/colors';
import { Complaint, Village } from '../types';
import { complaintService } from '../services/complaintService';
import { pindraVillages } from '../data/pindraVillages';

const complaintCategories = ['सड़क', 'बिजली', 'सफाई', 'पानी', 'अन्य'];

interface ComplaintsPageProps {
  selectedVillage: Village | 'All';
}

export const ComplaintsPage = React.memo(function ComplaintsPage({ selectedVillage }: ComplaintsPageProps) {
  const [filter, setFilter] = useState('all');
  const [newComplaint, setNewComplaint] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedSubmissionVillage, setSelectedSubmissionVillage] = useState<Village>(
    selectedVillage === 'All' ? pindraVillages[0] : selectedVillage
  );
  const [selectedCategory, setSelectedCategory] = useState('सड़क');
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [trackedComplaint, setTrackedComplaint] = useState<Complaint | null>(null);
  const [showTracking, setShowTracking] = useState(false);
  const [localComplaints, setLocalComplaints] = useState<Complaint[]>([]);

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    const data = await complaintService.getComplaints();
    setLocalComplaints(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  useEffect(() => {
    if (selectedVillage !== 'All') {
      setSelectedSubmissionVillage(selectedVillage);
    }
  }, [selectedVillage]);

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: colors.accent.light, text: colors.accent.dark, label: 'लंबित' },
    'in-progress': { bg: '#E3F2FD', text: '#1976D2', label: 'प्रगति में' },
    resolved: { bg: '#F1F8E9', text: '#558B2F', label: 'समाधान' },
  };

  const filtered = useMemo(() => {
    const villageFiltered = selectedVillage === 'All'
      ? localComplaints
      : localComplaints.filter(c => c.village.id === selectedVillage.id);

    return filter === 'all'
      ? villageFiltered
      : villageFiltered.filter((c) => c.status === filter);
  }, [filter, localComplaints, selectedVillage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (newComplaint.trim() && userName.trim()) {
      setLoading(true);
      const result = await complaintService.submitComplaint({
        title: newComplaint,
        description: newComplaint,
        userName,
        village: selectedSubmissionVillage as any,
        category: selectedCategory,
        image: selectedImage,
      });

      alert(`आपकी शिकायत दर्ज कर ली गई है। आपका ट्रैकिंग आईडी है: ${result.trackingId}`);
      setNewComplaint('');
      setUserName('');
      setSelectedImage(undefined);
      loadComplaints();
    }
  };

  const handleTrack = async () => {
    if (!trackingId.trim()) return;
    setLoading(true);
    const result = await complaintService.getComplaintStatus(trackingId.trim());
    setTrackedComplaint(result);
    setLoading(false);
  };

  const handleVote = useCallback(
    (id: number) => {
      setLocalComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, votes: (c.votes || 0) + 1 } : c))
      );
    },
    []
  );

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Tracking Toggle */}
      <div style={{ padding: '16px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setShowTracking(false)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: !showTracking ? colors.primary.main : colors.neutral.light,
            color: !showTracking ? colors.neutral.white : colors.text.primary,
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📝 शिकायत दर्ज करें
        </button>
        <button
          onClick={() => setShowTracking(true)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: showTracking ? colors.primary.main : colors.neutral.light,
            color: showTracking ? colors.neutral.white : colors.text.primary,
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🔍 ट्रैक करें
        </button>
      </div>

      {showTracking ? (
        <div style={{ padding: '16px', backgroundColor: colors.neutral.light, borderRadius: '12px', margin: '0 16px 16px 16px', border: `1px solid ${colors.border}` }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>शिकायत की स्थिति जांचें</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="ट्रैकिंग आईडी दर्ज करें (उदा: CMP-XYZ)"
              style={{
                flex: 1,
                padding: '12px',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              style={{
                padding: '0 20px',
                backgroundColor: colors.primary.main,
                color: colors.neutral.white,
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {loading ? '...' : 'जांचें'}
            </button>
          </div>

          {trackedComplaint && (
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: colors.neutral.white, borderRadius: '8px', border: `1px solid ${colors.primary.main}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>{trackedComplaint.title}</span>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  backgroundColor: statusColors[trackedComplaint.status].bg,
                  color: statusColors[trackedComplaint.status].text
                }}>
                  {statusColors[trackedComplaint.status].label}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: colors.text.secondary }}>
                दिनांक: {trackedComplaint.date}
              </div>
              {trackedComplaint.remarks && (
                <div style={{ marginTop: '8px', fontSize: '13px', padding: '8px', backgroundColor: '#f0f7ff', borderRadius: '4px' }}>
                  <strong>अधिकारी की टिप्पणी:</strong> {trackedComplaint.remarks}
                </div>
              )}
            </div>
          )}
          {trackedComplaint === null && trackingId && !loading && (
            <div style={{ marginTop: '12px', color: colors.status.error, fontSize: '13px' }}>
              कोई शिकायत नहीं मिली। कृपया आईडी की जांच करें।
            </div>
          )}
        </div>
      ) : (
        <>
      {/* Pradhan Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', padding: '16px', paddingTop: 0 }}>
        <div style={{ backgroundColor: colors.neutral.white, padding: '16px', borderRadius: '12px', textAlign: 'center', border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.primary.main }}>{localComplaints.length}</div>
          <div style={{ fontSize: '12px', color: colors.text.secondary }}>कुल शिकायतें</div>
        </div>
        <div style={{ backgroundColor: colors.neutral.white, padding: '16px', borderRadius: '12px', textAlign: 'center', border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#558B2F' }}>{localComplaints.filter(c => c.status === 'resolved').length}</div>
          <div style={{ fontSize: '12px', color: colors.text.secondary }}>समाधान</div>
        </div>
        <div style={{ backgroundColor: colors.neutral.white, padding: '16px', borderRadius: '12px', textAlign: 'center', border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.accent.dark }}>{localComplaints.filter(c => c.status === 'pending').length}</div>
          <div style={{ fontSize: '12px', color: colors.text.secondary }}>लंबित</div>
        </div>
      </div>

      {/* Submission Form */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.light, borderRadius: '8px', margin: '0 16px 16px 16px' }}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="आपका नाम"
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            boxSizing: 'border-box',
          }}
        />

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
          ग्राम चुनें:
        </label>
        <select
          value={selectedSubmissionVillage.id}
          onChange={(e) => {
            const village = pindraVillages.find(v => v.id === Number(e.target.value));
            if (village) setSelectedSubmissionVillage(village);
          }}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            boxSizing: 'border-box',
          }}
        >
          {pindraVillages.map((v) => (
            <option key={v.id} value={v.id}>{v.hindiName || v.name}</option>
          ))}
        </select>

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

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
            फोटो जोड़ें (वैकल्पिक):
          </label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{
              flex: 1,
              padding: '12px',
              backgroundColor: colors.neutral.white,
              border: `2px dashed ${colors.border}`,
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              {selectedImage ? '✅ फोटो चुन ली गई' : '📷 फोटो खींचें या चुनें'}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
            {selectedImage && (
              <div style={{ position: 'relative' }}>
                <img
                  src={selectedImage}
                  alt="Preview"
                  style={{ width: '45px', height: '45px', borderRadius: '4px', objectFit: 'cover' }}
                />
                <button
                  onClick={() => setSelectedImage(undefined)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: colors.status.error,
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? colors.text.secondary : colors.primary.main,
            color: colors.neutral.white,
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'default' : 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
        >
          {loading ? 'सबमिट हो रहा है...' : 'शिकायत सबमिट करें'}
        </button>
      </div>
      </>
      )}

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
                    {complaint.userName} • {complaint.village.hindiName || complaint.village.name} • {complaint.category} • {complaint.date} {complaint.time}
                  </div>
                  {complaint.trackingId && (
                    <div style={{ fontSize: '11px', color: colors.primary.main, marginTop: '4px', fontWeight: 'bold' }}>
                      ID: {complaint.trackingId}
                    </div>
                  )}
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
                  {statusColors[complaint.status].label}
                </div>
              </div>
              <p style={{ margin: '8px 0', fontSize: '14px', color: colors.text.primary }}>
                {complaint.description}
              </p>
              {complaint.image && (
                <div style={{ marginBottom: '12px' }}>
                  <img
                    src={complaint.image}
                    alt="Complaint"
                    style={{ width: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                </div>
              )}
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
