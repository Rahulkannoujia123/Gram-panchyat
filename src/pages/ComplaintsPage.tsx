import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { complaintsData } from '../data';
import { colors } from '../utils/colors';
import { Complaint, Village } from '../types';

const complaintCategories = ['सड़क', 'बिजली', 'सफाई', 'पानी', 'अन्य'];

const villages: Village[] = ['पिण्डरा', 'फूलपुर', 'सिंधौरा', 'बाबतपुर', 'खालिसपुर'];

interface ComplaintsPageProps {
  selectedVillage: Village | 'All';
}

export const ComplaintsPage = React.memo(function ComplaintsPage({ selectedVillage }: ComplaintsPageProps) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPradhan, setCurrentPradhan] = useState<{name: string, phone: string} | null>(null);
  const [newComplaint, setNewComplaint] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSubmissionVillage, setSelectedSubmissionVillage] = useState<Village>(
    selectedVillage === 'All' ? 'पिण्डरा' : selectedVillage
  );
  const [selectedCategory, setSelectedCategory] = useState('सड़क');

  useEffect(() => {
    if (selectedVillage !== 'All') {
      setSelectedSubmissionVillage(selectedVillage);

      // Fetch Pradhan for the selected village
      fetch(`https://randomuser.me/api/?nat=in&seed=${selectedVillage}`)
        .then(res => res.json())
        .then(data => {
          const user = data.results[0];
          setCurrentPradhan({
            name: `${user.name.first} ${user.name.last}`,
            phone: user.phone
          });
        })
        .catch(err => console.error(err));
    } else {
      setCurrentPradhan(null);
    }
  }, [selectedVillage]);
  const [localComplaints, setLocalComplaints] = useState(complaintsData);

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: colors.accent.light, text: colors.accent.dark },
    'in-progress': { bg: '#E3F2FD', text: '#1976D2' },
    resolved: { bg: '#F1F8E9', text: '#558B2F' },
  };

  const filtered = useMemo(() => {
    const villageFiltered = selectedVillage === 'All'
      ? localComplaints
      : localComplaints.filter(c => c.village === selectedVillage);

    const searchFiltered = villageFiltered.filter(c =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filter === 'all'
      ? searchFiltered
      : searchFiltered.filter((c) => c.status === filter);
  }, [filter, localComplaints, selectedVillage, searchTerm]);

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

  const handleSubmit = useCallback(() => {
    if (newComplaint.trim() && userName.trim()) {
      const complaint: Complaint = {
        id: Math.max(...localComplaints.map((c) => c.id), 0) + 1,
        title: newComplaint,
        description: newComplaint,
        date: new Date().toLocaleDateString('hi-IN'),
        time: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
        userName: userName,
        village: selectedSubmissionVillage,
        status: 'pending' as const,
        category: selectedCategory,
        votes: 0,
        image: selectedImage || undefined,
      };
      setLocalComplaints((prev) => [complaint, ...prev]);
      setNewComplaint('');
      setUserName('');
      setSelectedImage(null);
    }
  }, [newComplaint, userName, selectedSubmissionVillage, selectedCategory, localComplaints, selectedImage]);

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
      {/* Search Bar */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.light }}>
        <input
          type="text"
          placeholder="शिकायतें खोजें..."
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

      {/* Pradhan Dashboard */}
      {currentPradhan && (
        <div style={{ padding: '0 16px', marginTop: '16px' }}>
          <div style={{
            backgroundColor: colors.primary.light,
            padding: '12px',
            borderRadius: '12px',
            border: `1px solid ${colors.primary.main}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: colors.primary.dark, fontWeight: 'bold' }}>ग्राम प्रधान ({selectedVillage})</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{currentPradhan.name}</div>
            </div>
            <button
              onClick={() => window.location.href = `tel:${currentPradhan.phone}`}
              style={{
                backgroundColor: colors.primary.main,
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              📞 संपर्क करें
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', padding: '16px' }}>
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
          value={selectedSubmissionVillage}
          onChange={(e) => setSelectedSubmissionVillage(e.target.value as Village)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            boxSizing: 'border-box',
          }}
        >
          {villages.map((v) => (
            <option key={v} value={v}>{v}</option>
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
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: colors.neutral.white,
              border: `1px solid ${colors.primary.main}`,
              color: colors.primary.main,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: selectedImage ? '12px' : '0'
            }}
          >
            📷 फोटो खींचे / अपलोड करें
          </button>

          {selectedImage && (
            <div style={{ position: 'relative', width: '100px', height: '100px' }}>
              <img
                src={selectedImage}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: colors.accent.dark,
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

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
                    {complaint.userName} • {complaint.village} • {complaint.category} • {complaint.date} {complaint.time}
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
              {complaint.image && (
                <img
                  src={complaint.image}
                  alt="Complaint"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginTop: '8px',
                    marginBottom: '8px'
                  }}
                />
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
