import React, { useState, useMemo } from 'react';
import { workersData, serviceTypeHindi, availabilityHindi } from '../data/workers';
import { colors } from '../utils/colors';
import { ServiceType, Village } from '../types';
import { ALL_VILLAGES_HINDI } from '../data/pindraPanchayats';

export const WorkersPage = React.memo(function WorkersPage({ selectedVillage }: { selectedVillage: Village | 'All' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType | 'All'>('All');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    village: selectedVillage === 'All' ? 'पिण्डरा' : selectedVillage,
    address: '',
    serviceType: 'Electrician' as ServiceType,
    experience: '1 year' as any,
    rateStandard: '',
    rateComplex: '',
    rateEmergency: '',
    materialsExtra: true,
    availability: 'Available Now' as any
  });

  const speakWorkerDetails = (worker: any) => {
    const text = `${worker.name}, ${serviceTypeHindi[worker.serviceType]}. अनुभव ${worker.experience}. स्थान ${worker.location.village}. रेटिंग ${worker.trustScore.rating} स्टार.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('आपका ब्राउज़र वॉयस सर्च का समर्थन नहीं करता है।');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
    };
    recognition.start();
  };

  const filteredWorkers = useMemo(() => {
    return workersData.filter(worker => {
      const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          serviceTypeHindi[worker.serviceType].toLowerCase().includes(searchTerm.toLowerCase());
      const matchesService = selectedService === 'All' || worker.serviceType === selectedService;
      const matchesVillage = selectedVillage === 'All' || worker.location.village === selectedVillage;

      return matchesSearch && matchesService && matchesVillage;
    });
  }, [searchTerm, selectedService, selectedVillage]);

  return (
    <div className="page-transition" style={{ paddingBottom: '80px' }}>
      {/* Search and Filters */}
      <div style={{ padding: '16px', backgroundColor: colors.neutral.white, borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="कामगार खोजें (जैसे: बिजली मिस्त्री)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '18px' }}>🔍</span>
            </div>
            <button
              onClick={startListening}
              style={{
                padding: '0 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isListening ? colors.accent.dark : colors.primary.light,
                color: isListening ? 'white' : colors.primary.dark,
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              title="बोलकर खोजें"
            >
              {isListening ? '⏺️' : '🎤'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setSelectedService('All')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: selectedService === 'All' ? colors.primary.main : colors.neutral.light,
              color: selectedService === 'All' ? 'white' : colors.text.primary,
              fontSize: '12px',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            सभी काम
          </button>
          {Object.keys(serviceTypeHindi).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedService(type as ServiceType)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: selectedService === type ? colors.primary.main : colors.neutral.light,
                color: selectedService === type ? 'white' : colors.text.primary,
                fontSize: '12px',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {serviceTypeHindi[type].split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Workers List */}
      <div style={{ padding: '16px' }}>
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map(worker => (
            <div
              key={worker.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                border: `1px solid ${colors.border}`,
                boxShadow: `0 2px 4px ${colors.shadow}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '25px',
                    backgroundColor: colors.primary.light,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    👤
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {worker.name}
                      <button
                        onClick={() => speakWorkerDetails(worker)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                        title="विवरण सुनें"
                      >
                        🔊
                      </button>
                    </h3>
                    <div style={{ fontSize: '12px', color: colors.text.secondary }}>
                      {serviceTypeHindi[worker.serviceType]}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    backgroundColor: worker.availability === 'Available Now' ? '#E8F5E9' : '#FFF3E0',
                    color: worker.availability === 'Available Now' ? '#2E7D32' : '#E65100',
                    fontWeight: 'bold'
                  }}>
                    {availabilityHindi[worker.availability]}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '4px', fontWeight: 'bold', color: colors.primary.main }}>
                    ⭐ {worker.trustScore.rating} ({worker.trustScore.reviews} समीक्षाएं)
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '13px' }}>
                <div style={{ color: colors.text.secondary }}>📍 {worker.location.village}</div>
                <div style={{ color: colors.text.secondary }}>⏱️ {worker.experience} अनुभव</div>
              </div>

              <div style={{ backgroundColor: colors.neutral.light, padding: '8px', borderRadius: '8px', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>दरें (Rate Card):</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span>सामान्य: ₹{worker.rateCard.standard}/घंटा</span>
                  <span>इमरजेंसी: ₹{worker.rateCard.emergency}/घंटा</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.location.href = `tel:${worker.phone}`}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: colors.primary.main,
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  📞 कॉल करें
                </button>
                {worker.whatsapp && (
                  <button
                    onClick={() => window.location.href = `https://wa.me/91${worker.whatsapp}`}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: `1px solid #25D366`,
                      backgroundColor: 'white',
                      color: '#25D366',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    💬 व्हाट्सएप
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: colors.text.secondary }}>
            कोई कामगार नहीं मिला।
          </div>
        )}
      </div>

      {/* Registration Form Modal */}
      {showRegisterForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>नया कामगार पंजीकरण</h2>
              <button onClick={() => setShowRegisterForm(false)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>नाम (Name)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${colors.border}` }}
                  placeholder="अपना नाम लिखें"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>फ़ोन नंबर</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${colors.border}` }}
                    placeholder="9876543210"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>व्हाट्सएप नंबर</label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${colors.border}` }}
                    placeholder="वैकल्पिक"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>ग्राम (Village)</label>
                <select
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${colors.border}` }}
                >
                  {ALL_VILLAGES_HINDI.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>काम का प्रकार (Service)</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as ServiceType })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${colors.border}` }}
                >
                  {Object.entries(serviceTypeHindi).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>अनुभव (Experience)</label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${colors.border}` }}
                >
                  <option value="1 year">1 साल</option>
                  <option value="2-5 years">2-5 साल</option>
                  <option value="5-10 years">5-10 साल</option>
                  <option value="10+ years">10+ साल</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>दरें (Rate Card - ₹/घंटा)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    placeholder="सामान्य"
                    value={formData.rateStandard}
                    onChange={(e) => setFormData({ ...formData, rateStandard: e.target.value })}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${colors.border}` }}
                  />
                  <input
                    type="number"
                    placeholder="इमरजेंसी"
                    value={formData.rateEmergency}
                    onChange={(e) => setFormData({ ...formData, rateEmergency: e.target.value })}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${colors.border}` }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  alert('सफलतापूर्वक पंजीकृत! (डेमो)');
                  setShowRegisterForm(false);
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: colors.primary.main,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginTop: '10px',
                  cursor: 'pointer'
                }}
              >
                पंजीकरण जमा करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Fab */}
      <button
        onClick={() => setShowRegisterForm(true)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '30px',
          backgroundColor: colors.accent.dark,
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 100
        }}
        title="पंजीकरण करें"
      >
        ➕
      </button>
    </div>
  );
});
