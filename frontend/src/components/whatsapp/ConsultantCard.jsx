import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ConsultantCard = ({ consultant, isSelected, onSelect }) => {
  const { name, role, photo, languages, available } = consultant;

  return (
    <motion.button
      onClick={onSelect}
      type="button"
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.18 }}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '13px 14px',
        borderRadius: 10,
        border: isSelected ? '1px solid rgba(201,169,110,0.55)' : '1px solid rgba(255,255,255,0.07)',
        background: isSelected
          ? 'linear-gradient(135deg, rgba(201,169,110,0.10), rgba(201,169,110,0.04))'
          : 'rgba(255,255,255,0.03)',
        cursor: 'pointer',
        textAlign: 'left',
        outline: 'none',
        transition: 'background 0.2s, border 0.2s',
        boxShadow: isSelected ? '0 0 0 1px rgba(201,169,110,0.15) inset' : 'none',
      }}
    >
      {/* Left: Avatar + Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        {/* Photo */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={photo}
            alt={name}
            style={{
              width: 42, height: 42, borderRadius: '50%', objectFit: 'cover',
              border: isSelected ? '1.5px solid rgba(201,169,110,0.6)' : '1.5px solid rgba(255,255,255,0.1)',
            }}
          />
          {available && (
            <span style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 10, height: 10, borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #0E0E10',
            }} />
          )}
        </div>

        {/* Info */}
        <div style={{ minWidth: 0 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F0EBE0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name}
          </h4>
          <p style={{ fontSize: 11, color: 'rgba(240,235,224,0.45)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {role}
          </p>
          {/* Language tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
            {languages.map((lang) => (
              <span
                key={lang}
                style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                  padding: '2px 7px', borderRadius: 4,
                  background: 'rgba(201,169,110,0.10)',
                  color: 'rgba(201,169,110,0.75)',
                  border: '1px solid rgba(201,169,110,0.18)',
                  textTransform: 'uppercase',
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Available + Check */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {available && (
          <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Available
          </span>
        )}
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          border: isSelected ? '1.5px solid #C9A96E' : '1.5px solid rgba(255,255,255,0.18)',
          background: isSelected ? 'linear-gradient(135deg, #C9A96E, #a07e45)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {isSelected && <Check style={{ width: 11, height: 11, color: '#0E0E10', strokeWidth: 3 }} />}
        </div>
      </div>
    </motion.button>
  );
};

export default ConsultantCard;
