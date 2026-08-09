import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Calendar, Check, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// EMI Calculator UI
export const EMICard = ({ initialPrincipal = 50000000 }) => {
  const [loanAmount, setLoanAmount] = useState(initialPrincipal);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [calculatedEMI, setCalculatedEMI] = useState(0);

  useEffect(() => {
    if (loanAmount > 0) {
      const P = loanAmount;
      const r = interestRate / 12 / 100;
      const n = tenureYears * 12;
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setCalculatedEMI(Math.round(emi));
    }
  }, [loanAmount, interestRate, tenureYears]);

  return (
    <div className="border border-[rgba(93,100,114,0.15)] bg-white rounded-xl p-6 space-y-6 font-sans shadow-xs">
      <div className="flex items-center gap-2 border-b border-[rgba(93,100,114,0.15)] pb-4">
        <Calculator className="w-4 h-4 text-[#CFB6A8]" />
        <h4
          className="text-xs uppercase tracking-wider font-bold text-[#363C46]"
          style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
        >
          EMI Estimation Tool
        </h4>
      </div>

      <div className="space-y-4 text-xs font-bold">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[#5D6472] font-medium">Loan Principal</span>
            <span className="text-[#363C46] font-bold">₹{(loanAmount / 10000000).toFixed(2)} Cr</span>
          </div>
          <input 
            type="range" 
            min="1000000" 
            max={initialPrincipal * 1.5}
            step="500000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseInt(e.target.value))}
            className="w-full accent-[#CFB6A8] cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[#5D6472] font-medium">Interest Rate (YoY)</span>
            <span className="text-[#363C46] font-bold">{interestRate}%</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="15"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="w-full accent-[#CFB6A8] cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[#5D6472] font-medium">Loan Tenure</span>
            <span className="text-[#363C46] font-bold">{tenureYears} Years</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="30"
            step="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(parseInt(e.target.value))}
            className="w-full accent-[#CFB6A8] cursor-pointer"
          />
        </div>

        <div className="border-t border-[rgba(93,100,114,0.15)] pt-4 mt-2 flex justify-between items-end">
          <div>
            <span className="text-[#5D6472] text-[10px] uppercase font-bold">Estimated monthly payment</span>
            <p
              className="text-xl font-bold text-[#CFB6A8] mt-0.5"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              ₹{calculatedEMI.toLocaleString('en-IN')}
            </p>
          </div>
          <span className="text-[9px] text-[#5D6472] uppercase tracking-widest font-bold bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.15)] px-2 py-1 rounded-md">
            80% LTV Max
          </span>
        </div>
      </div>
    </div>
  );
};

// Booking Card: Concierge visit scheduler
export const BookingCard = ({ propertyTitle, propertyCity, propertyId, onConsultantAssigned }) => {
  const { showToast, addSiteVisit } = useApp();
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingDate) return;

    setIsSubmitting(true);
    const clientEmail = `${bookingName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}@imperiaestates.com`;

    try {
      if (addSiteVisit) {
        const res = await addSiteVisit({
          propertyId,
          propertyName: propertyTitle || 'IMPERIA Residence',
          city: propertyCity || 'Chennai',
          date: bookingDate,
          time: bookingTime,
          status: 'Scheduled',
          name: bookingName,
          phone: bookingPhone,
          email: clientEmail,
        });

        if (res?.assignedConsultant && typeof onConsultantAssigned === 'function') {
          onConsultantAssigned(res.assignedConsultant);
        }
      }

      setIsSubmitting(false);
      setIsBooked(true);
      if (showToast) showToast('Private tour scheduled! Our executive will contact you.');
    } catch (err) {
      setIsSubmitting(false);
      if (showToast) showToast(`Booking failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="border border-[rgba(93,100,114,0.15)] bg-white rounded-xl p-6 md:p-8 space-y-6 font-sans shadow-xs">
      <div className="border-b border-[rgba(93,100,114,0.15)] pb-4 space-y-1">
        <span className="text-[9px] uppercase tracking-[0.25em] text-[#CFB6A8] font-bold block">Walkthrough Booking</span>
        <h3
          className="text-lg font-bold text-[#363C46] tracking-tight"
          style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
        >
          Schedule Private Visit
        </h3>
      </div>

      {isBooked ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-[#CFB6A8] bg-[rgba(207,182,168,0.12)] rounded-lg p-6 text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-[#CFB6A8] text-[#363C46] flex items-center justify-center mx-auto shadow-xs">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <h4
            className="text-base font-bold text-[#363C46]"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            Visit Request Scheduled
          </h4>
          <p className="text-xs text-[#5D6472] leading-relaxed font-sans font-medium">
            A private relationships coordinator will reach out to organize logistics for <span className="text-[#363C46] font-bold">{bookingDate}</span> at <span className="text-[#363C46] font-bold">{bookingTime}</span>.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs text-[#363C46]">
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#5D6472] uppercase tracking-wider font-bold">Your Name</label>
            <input 
              type="text" 
              placeholder="Enter full name" 
              value={bookingName}
              onChange={(e) => setBookingName(e.target.value)}
              required
              className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg px-4 py-3 text-[#363C46] placeholder-[#5D6472]/60 outline-none focus:border-[#CFB6A8]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-[#5D6472] uppercase tracking-wider font-bold">Your Phone</label>
            <input 
              type="tel" 
              maxLength={10}
              placeholder="e.g. 9876543210" 
              value={bookingPhone}
              onChange={(e) => setBookingPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
              className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg px-4 py-3 text-[#363C46] placeholder-[#5D6472]/60 outline-none focus:border-[#CFB6A8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#5D6472] uppercase tracking-wider font-bold">Select Date</label>
              <input 
                type="date" 
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg px-3 py-2.5 text-[#363C46] outline-none focus:border-[#CFB6A8]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#5D6472] uppercase tracking-wider font-bold">Preferred Time</label>
              <select 
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg px-3 py-2.5 text-[#363C46] outline-none focus:border-[#CFB6A8] cursor-pointer"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 bg-[#363C46] hover:bg-[#1A1A1A] text-xs font-bold text-white tracking-wider uppercase rounded-lg shadow-xs cursor-pointer transition-all"
          >
            REQUEST WALKTHROUGH VISIT
          </button>
        </form>
      )}
    </div>
  );
};

// Section Header: Editorial labels with mixed-weight typography
export const SectionHeader = ({ tag, title, desc }) => {
  return (
    <div className="space-y-3 mb-10 text-left font-sans">
      {tag && <span className="text-xs uppercase tracking-[0.25em] text-[#CFB6A8] font-bold block">{tag}</span>}
      {title && (
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#363C46] tracking-tight [&_em]:font-normal [&_em]:text-[#5D6472] [&_em]:not-italic [&_span.light]:font-normal [&_span.light]:text-[#5D6472]"
          style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
        >
          {title}
        </h2>
      )}
      {desc && (
        <p className="text-[#5D6472] text-xs md:text-sm font-sans font-normal leading-relaxed max-w-xl">
          {desc}
        </p>
      )}
    </div>
  );
};

// Animated Button CTA wrapper
export const AnimatedButton = ({ children, onClick, className = "", variant = "primary" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer font-sans ${
        variant === 'primary'
          ? 'bg-[#363C46] hover:bg-[#1A1A1A] text-white shadow-xs'
          : 'border border-[rgba(93,100,114,0.20)] bg-white hover:border-[#CFB6A8] text-[#363C46] shadow-xs'
      } ${className}`}
    >
      {children}
    </motion.button>
  );
};
