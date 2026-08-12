import React, { useState } from 'react';
import { Clock, Shield } from 'lucide-react';
import ConsultantCard from './ConsultantCard';
import QuickQuestions from './QuickQuestions';
import MessageComposer from './MessageComposer';
import { consultants as mockConsultants } from '../../data/consultants';

const DEFAULT_CONSULTANT_PHONE = "919876543210";

const WhatsAppPanel = ({
  consultants = mockConsultants.slice(0, 2),
  questions = ['Book Site Visit', 'Property Details', 'Pricing'],
  onShowToast
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedConsultant = consultants.find(c => c.id === selectedId);

  const handleSelectQuestion = (q) => {
    setSelectedInquiry(q);
    setMessage(`I would like to inquire about: ${q}.`);
  };

  const handleWhatsAppChat = () => {
    if (!selectedConsultant) {
      if (onShowToast) onShowToast('Please select a Property Consultant first.');
      return;
    }
    const rawPhone = selectedConsultant.phoneNumber || DEFAULT_CONSULTANT_PHONE;
    const phone = rawPhone.replace(/[^0-9]/g, '');
    const consultantName = selectedConsultant.name || 'Property Consultant';
    const inquiryText = selectedInquiry || 'General Inquiry';
    const userTypedMessage = message.trim() || 'I am interested in exploring available luxury properties.';
    const fullMessageText = `Hello,\n\nI am interested in your luxury properties.\n\nConsultant:\n${consultantName}\n\nInquiry:\n${inquiryText}\n\nMessage:\n${userTypedMessage}\n\nPlease contact me regarding this property.\n\nThank you.`;
    const encodedMessage = encodeURIComponent(fullMessageText);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.open(whatsappUrl, '_blank');
      if (onShowToast) onShowToast(`Opening WhatsApp chat with ${consultantName}...`);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-5" style={{ color: '#F0EBE0', fontFamily: 'sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ borderBottom: '1px solid rgba(201,169,110,0.15)', paddingBottom: '1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Monogram */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A96E, #a07e45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(201,169,110,0.25)',
          }}>
            <span style={{ color: '#0E0E10', fontWeight: 800, fontSize: 15 }}>I</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: '#C9A96E' }}>
            IMPERIA ESTATES
          </span>
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F0EBE0', marginTop: '0.75rem', letterSpacing: '-0.01em' }}>
          Private Concierge
        </h3>
        <p style={{ fontSize: 12, color: 'rgba(240,235,224,0.45)', marginTop: '0.25rem', lineHeight: 1.5 }}>
          Connect directly with our senior wealth advisors via WhatsApp
        </p>
      </div>

      {/* ── Consultant List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {consultants.map((consultant) => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            isSelected={selectedId === consultant.id}
            onSelect={() => setSelectedId(consultant.id)}
          />
        ))}
      </div>

      {/* ── Quick Inquiry Chips ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(201,169,110,0.6)', textTransform: 'uppercase' }}>
          Quick Inquiries
        </span>
        <QuickQuestions questions={questions} onSelectQuestion={handleSelectQuestion} />
      </div>

      {/* ── Message Composer ── */}
      <div style={{ paddingTop: '0.1rem' }}>
        <MessageComposer
          message={message}
          onMessageChange={setMessage}
          onSend={handleWhatsAppChat}
          isLoading={isLoading}
          hasSelectedConsultant={!!selectedConsultant}
        />
      </div>

      {/* ── Footer Info ── */}
      <div style={{
        borderTop: '1px solid rgba(201,169,110,0.12)',
        paddingTop: '1rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock style={{ width: 15, height: 15, color: '#C9A96E', flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(201,169,110,0.55)', textTransform: 'uppercase' }}>Mon – Sat</p>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#F0EBE0', marginTop: 2 }}>9:00 AM – 7:00 PM</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderLeft: '1px solid rgba(201,169,110,0.12)', paddingLeft: '1rem' }}>
          <Shield style={{ width: 15, height: 15, color: '#C9A96E', flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(201,169,110,0.55)', textTransform: 'uppercase' }}>Priority</p>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#F0EBE0', marginTop: 2 }}>24/7 Desk</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WhatsAppPanel;
