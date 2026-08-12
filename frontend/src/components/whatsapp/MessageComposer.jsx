import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MessageComposer = ({ message, onMessageChange, onSend, isLoading, hasSelectedConsultant }) => {
  const isButtonDisabled = !hasSelectedConsultant || isLoading;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Textarea */}
      <textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder={hasSelectedConsultant ? 'Type your message...' : 'Select a consultant first...'}
        disabled={!hasSelectedConsultant}
        rows={3}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(201,169,110,0.18)',
          borderRadius: 8,
          padding: '12px 14px',
          fontSize: 12,
          fontWeight: 500,
          color: '#F0EBE0',
          caretColor: '#C9A96E',
          outline: 'none',
          resize: 'none',
          fontFamily: 'inherit',
          transition: 'border 0.2s',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.45)'}
        onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.18)'}
      />

      {/* Validation */}
      {!hasSelectedConsultant && (
        <p style={{ fontSize: 11, color: 'rgba(201,169,110,0.65)', fontWeight: 600, textAlign: 'center' }}>
          Please select a consultant to initiate chat
        </p>
      )}

      {/* Send Button */}
      <motion.button
        whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
        whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
        transition={{ duration: 0.18 }}
        disabled={isButtonDisabled}
        onClick={onSend}
        type="button"
        style={{
          width: '100%',
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          outline: 'none',
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
          border: 'none',
          transition: 'all 0.2s',
          background: isButtonDisabled
            ? 'rgba(255,255,255,0.05)'
            : 'linear-gradient(135deg, #C9A96E 0%, #a07e45 100%)',
          color: isButtonDisabled ? 'rgba(240,235,224,0.25)' : '#0E0E10',
          boxShadow: isButtonDisabled ? 'none' : '0 6px 20px rgba(201,169,110,0.25)',
        }}
      >
        {isLoading ? (
          <>
            <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite', color: '#0E0E10' }} />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg style={{ width: 15, height: 15, fill: isButtonDisabled ? 'rgba(240,235,224,0.2)' : '#0E0E10', flexShrink: 0 }} viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.115-2.905-6.99C16.257 1.875 13.779.845 11.14.845 5.702.845 1.278 5.27 1.275 10.71c-.001 1.637.424 3.23 1.232 4.636L1.517 21.02l5.13-1.866zm12.353-6.55c-.298-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.15-.173.2-.297.298-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            <span>Chat on WhatsApp</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default MessageComposer;
