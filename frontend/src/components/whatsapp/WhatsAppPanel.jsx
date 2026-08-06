import React, { useState } from 'react';
import { Clock, Shield } from 'lucide-react';
import ConsultantCard from './ConsultantCard';
import QuickQuestions from './QuickQuestions';
import MessageComposer from './MessageComposer';
import { consultants as mockConsultants } from '../../data/consultants';

// Default dummy number constant (future-ready for backend consultant.phoneNumber)
const DEFAULT_CONSULTANT_PHONE = "919876543210";

const WhatsAppPanel = ({ 
  consultants = mockConsultants.slice(0, 2), // Only show TWO consultants
  questions = ['Book Site Visit', 'Property Details', 'Pricing'], // Only THREE chips
  onShowToast
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedConsultant = consultants.find(c => c.id === selectedId);

  const handleSelectQuestion = (q) => {
    setSelectedInquiry(q);
    if (selectedConsultant) {
      setMessage(`I would like to inquire about: ${q}.`);
    } else {
      setMessage(`I would like to inquire about: ${q}.`);
    }
  };

  // Dedicated helper function for WhatsApp chat redirection
  const handleWhatsAppChat = () => {
    // 1. Validate that a consultant has been selected
    if (!selectedConsultant) {
      if (onShowToast) {
        onShowToast('Please select a Property Consultant first.');
      }
      return; // Do NOT navigate anywhere, do not open WhatsApp
    }

    // 2. Future-ready phone number retrieval (prefers backend consultant.phoneNumber or fallback constant)
    const rawPhone = selectedConsultant.phoneNumber || DEFAULT_CONSULTANT_PHONE;
    const phone = rawPhone.replace(/[^0-9]/g, '');

    // 3. Build structured professional message
    const consultantName = selectedConsultant.name || 'Property Consultant';
    const inquiryText = selectedInquiry || 'General Inquiry';
    const userTypedMessage = message.trim() || 'I am interested in exploring available luxury properties.';

    const fullMessageText = `Hello,\n\nI am interested in your luxury properties.\n\nConsultant:\n${consultantName}\n\nInquiry:\n${inquiryText}\n\nMessage:\n${userTypedMessage}\n\nPlease contact me regarding this property.\n\nThank you.`;

    // 4. Properly encode message using encodeURIComponent()
    const encodedMessage = encodeURIComponent(fullMessageText);

    // 5. Build official WhatsApp URL (https://wa.me/<PHONE_NUMBER>?text=<ENCODED_MESSAGE>)
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // 6. Open WhatsApp automatically in a new browser tab
      window.open(whatsappUrl, "_blank");

      if (onShowToast) {
        onShowToast(`Opening WhatsApp chat with ${consultantName}...`);
      }
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6 text-[#1A1A1A] font-sans">
      {/* Header */}
      <div className="border-b border-[#E8E4DA] pb-5">
        <div className="flex items-center gap-3">
          {/* Monogram circle */}
          <div className="w-10 h-10 rounded-full bg-[#F5A623] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <span className="text-base font-bold">I</span>
          </div>
          <span className="text-base font-bold tracking-[0.25em] text-[#1A1A1A] block">
            IMPERIA ESTATES
          </span>
        </div>
        <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight mt-3">
          Property Concierge
        </h3>
        <p className="text-xs text-[#8A8A85] font-sans font-normal mt-1 leading-relaxed">
          Connect directly with senior advisors via WhatsApp
        </p>
      </div>

      {/* Consultant List (Limit to 2) */}
      <div className="space-y-3.5">
        {consultants.map((consultant) => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            isSelected={selectedId === consultant.id}
            onSelect={() => setSelectedId(consultant.id)}
          />
        ))}
      </div>

      {/* Quick Inquiry Chips (Limit to 3) */}
      <div className="space-y-3.5">
        <span className="text-[10px] uppercase tracking-widest text-[#8A8A85] font-bold block font-sans">
          Quick Inquiries
        </span>
        <QuickQuestions
          questions={questions}
          onSelectQuestion={handleSelectQuestion}
        />
      </div>

      {/* Message Composer & Send Button */}
      <div className="pt-1">
        <MessageComposer
          message={message}
          onMessageChange={setMessage}
          onSend={handleWhatsAppChat}
          isLoading={isLoading}
          hasSelectedConsultant={!!selectedConsultant}
        />
      </div>

      {/* Business Hours & Support Grid */}
      <div className="border-t border-[#E8E4DA] pt-4 grid grid-cols-2 gap-4 text-xs font-sans">
        {/* Mon - Sat column */}
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-[#F5A623] shrink-0 stroke-[2]" />
          <div className="text-left leading-tight">
            <p className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Mon – Sat</p>
            <p className="text-xs text-[#1A1A1A] font-bold mt-0.5">9:00 AM – 7:00 PM</p>
          </div>
        </div>

        {/* Support column */}
        <div className="flex items-center gap-2.5 border-l border-[#E8E4DA] pl-4">
          <Shield className="w-4 h-4 text-[#F5A623] shrink-0 stroke-[2]" />
          <div className="text-left leading-tight">
            <p className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Priority Support</p>
            <p className="text-xs text-[#1A1A1A] font-bold mt-0.5">24/7 Desk</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPanel;
