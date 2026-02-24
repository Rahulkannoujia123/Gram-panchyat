import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Village } from '../types';
import { colors } from '../utils/colors';

interface VillageSelectorProps {
  villages: Village[];
  selectedVillageId?: number;
  onSelect: (villageId: number, villageName: string) => void;
  placeholder?: string;
}

export const VillageSelector = React.memo(function VillageSelector({
  villages,
  selectedVillageId,
  onSelect,
  placeholder = 'गाँव चुनें...',
}: VillageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedVillage = villages.find(v => v.id === selectedVillageId);

  // Filter villages based on search term
  const filteredVillages = useMemo(() => {
    if (!searchTerm.trim()) return villages;
    
    const term = searchTerm.toLowerCase();
    return villages.filter(v => 
      v.name.toLowerCase().includes(term) || 
      v.description?.toLowerCase().includes(term)
    );
  }, [villages, searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (villageId: number, villageName: string) => {
    onSelect(villageId, villageName);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'relative',
        marginBottom: '16px',
      }}
    >
      {/* Search Input */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '12px 16px',
          border: `2px solid ${colors.primary}`,
          borderRadius: '8px',
          backgroundColor: colors.neutral.light,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={isOpen ? searchTerm : selectedVillage?.name || placeholder}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '14px',
            width: '100%',
            outline: 'none',
            color: colors.text.primary,
          }}
        />
        <span style={{ marginLeft: '8px', fontSize: '12px' }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            backgroundColor: colors.neutral.light,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {filteredVillages.length === 0 ? (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                color: colors.text.secondary,
                fontSize: '14px',
              }}
            >
              कोई गाँव नहीं मिला
            </div>
          ) : (
            filteredVillages.map((village) => (
              <div
                key={village.id}
                onClick={() => handleSelect(village.id, village.name)}
                style={{
                  padding: '12px 16px',
                  borderBottom: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  backgroundColor: selectedVillageId === village.id ? colors.primary + '10' : 'transparent',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary + '20';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    selectedVillageId === village.id ? colors.primary + '10' : 'transparent';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '500', color: colors.text.primary }}>
                      {village.icon} {village.name}
                    </div>
                    <div style={{ fontSize: '12px', color: colors.text.secondary, marginTop: '4px' }}>
                      जनसंख्या: {village.population.toLocaleString('hi-IN')} | वार्ड: {village.wards}
                    </div>
                  </div>
                  {selectedVillageId === village.id && (
                    <span style={{ fontSize: '18px' }}>✓</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
});
