import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Phone, User, Mail, Building, Clock, Check, X, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/**
 * BookSiteVisitModal — Phase 2 restyled
 * Modal chrome (backdrop, card, border-radius, typography) updated to
 * Arsenic/Black Coral/Dark Vanilla/Azureish White palette.
 * All form logic, validation, state, API calls preserved unchanged.
 */
const BookSiteVisitModal = () => {
  const {
    isBookModalOpen = false,
    closeBookModal = () => {},
    bookModalProperty = null,
    showToast = () => {},
    properties = [],
    addSiteVisit = async () => {},
    currentUser = null,
  } = useApp() || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '10:00 AM',
    property: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync property name & current logged-in user info when modal opens
  useEffect(() => {
    if (isBookModalOpen) {
      let resolvedTitle = 'Architectural Estate';

      if (typeof bookModalProperty === 'string' && bookModalProperty.trim()) {
        resolvedTitle = bookModalProperty;
      } else if (bookModalProperty && typeof bookModalProperty === 'object') {
        resolvedTitle = bookModalProperty.title || bookModalProperty.name || bookModalProperty.propertyName || (properties[0] ? properties[0].title : 'Architectural Estate');
      } else if (properties && properties.length > 0) {
        resolvedTitle = properties[0].title || properties[0].name || 'Architectural Estate';
      }

      setFormData({
        name: currentUser?.fullName || currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        property: resolvedTitle
      });
      setErrors({});
      setIsSubmitted(false);
    }
  }, [isBookModalOpen, bookModalProperty, properties, currentUser]);

  // Lock scroll
  useEffect(() => {
    if (isBookModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isBookModalOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isBookModalOpen) {
        closeBookModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookModalOpen, closeBookModal]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    const phoneClean = formData.phone.replace(/\D/g, '');
    if (!phoneClean) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneClean.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (!formData.date) newErrors.date = 'Preferred date is required';
    if (!formData.time) newErrors.time = 'Preferred time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await addSiteVisit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        propertyName: formData.property,
        date: formData.date,
        time: formData.time,
        city: bookModalProperty?.city || 'Chennai',
        propertyId: bookModalProperty?.id || bookModalProperty?._id,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast(`Site visit request submitted for ${formData.property}`);
    } catch (err) {
      setIsSubmitting(false);
      showToast(`Booking failed: ${err.message}`, 'error');
    }
  };

  const timeSlots = [
    '09:00 AM',
    '11:00 AM',
    '02:00 PM',
    '04:00 PM',
    '06:00 PM'
  ];

  // ── Shared field style helpers ──────────────────────────────────────────────
  const fieldBase = 'w-full bg-[#E0EEE9] border focus:border-[#5D6472] outline-none rounded-lg py-3 text-xs text-[#363C46] font-medium placeholder-[#5D6472] transition-all font-sans';
  const fieldErr  = 'border-red-500';
  const fieldOk   = 'border-[rgba(93,100,114,0.20)]';

  return (
    <AnimatePresence>
      {isBookModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBookModal}
            className="fixed inset-0 z-[9998]"
            style={{ background: 'rgba(54,60,70,0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-lg z-[9999] max-h-[90vh] overflow-y-auto custom-scrollbar text-left"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(93,100,114,0.15)',
              borderRadius: 12,
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(54,60,70,0.14)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeBookModal}
              className="absolute top-5 right-5 p-2 rounded-full transition-colors cursor-pointer outline-none hover:bg-[#E0EEE9]"
              style={{ color: '#5D6472' }}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="booking-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Header */}
                  <div style={{ borderBottom: '1px solid rgba(93,100,114,0.15)', paddingBottom: '1rem', marginBottom: '0.25rem' }}>
                    <span className="text-[10px] uppercase tracking-[0.22em] font-bold block" style={{ color: '#CFB6A8' }}>
                      IMPERIA ESTATES PRIVATE CONCIERGE
                    </span>
                    <h3
                      className="text-xl font-medium tracking-tight mt-1.5"
                      style={{ fontFamily: "'Fraunces', 'Playfair Display', serif", color: '#363C46' }}
                    >
                      Book Private Site Visit
                    </h3>
                    <p className="text-xs font-normal mt-1 leading-relaxed" style={{ color: '#5D6472' }}>
                      Schedule a chauffeur-driven private estate tour with our senior property advisors.
                    </p>
                  </div>

                  {/* Property Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider font-bold" style={{ color: '#5D6472' }}>
                      Selected Estate / Project
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#CFB6A8' }} />
                      <input
                        type="text"
                        value={formData.property}
                        onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                        placeholder="Enter or select property name"
                        className={`${fieldBase} pl-11 pr-4 ${fieldOk}`}
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider font-bold" style={{ color: '#5D6472' }}>
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#CFB6A8' }} />
                      <input
                        type="text"
                        placeholder="e.g. Alexander Wright"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: null });
                        }}
                        className={`${fieldBase} pl-11 pr-4 ${errors.name ? fieldErr : fieldOk}`}
                      />
                    </div>
                    {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase tracking-wider font-bold" style={{ color: '#5D6472' }}>
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#CFB6A8' }} />
                        <input
                          type="email"
                          placeholder="client@luxury.com"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: null });
                          }}
                          className={`${fieldBase} pl-10 pr-3 ${errors.email ? fieldErr : fieldOk}`}
                        />
                      </div>
                      {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase tracking-wider font-bold" style={{ color: '#5D6472' }}>
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#CFB6A8' }} />
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="e.g. 9876543210"
                          value={formData.phone}
                          onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData({ ...formData, phone: digitsOnly });
                            if (errors.phone) setErrors({ ...errors, phone: null });
                          }}
                          className={`${fieldBase} pl-10 pr-3 ${errors.phone ? fieldErr : fieldOk}`}
                        />
                      </div>
                      {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Date & Time Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase tracking-wider font-bold" style={{ color: '#5D6472' }}>
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#CFB6A8' }} />
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => {
                            setFormData({ ...formData, date: e.target.value });
                            if (errors.date) setErrors({ ...errors, date: null });
                          }}
                          className={`${fieldBase} pl-10 pr-3 ${errors.date ? fieldErr : fieldOk}`}
                        />
                      </div>
                      {errors.date && <p className="text-[10px] text-red-500 font-bold">{errors.date}</p>}
                    </div>

                    {/* Time */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase tracking-wider font-bold" style={{ color: '#5D6472' }}>
                        Preferred Time *
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#CFB6A8' }} />
                        <select
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className={`${fieldBase} pl-10 pr-3 cursor-pointer`}
                          style={{ border: '1px solid rgba(93,100,114,0.20)' }}
                        >
                          {timeSlots.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={isSubmitting ? {} : { opacity: 0.88 }}
                    whileTap={isSubmitting ? {} : { scale: 0.98 }}
                    className="w-full py-3.5 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                    style={{
                      background: '#363C46',
                      color: '#FFFFFF',
                      borderRadius: 6,
                      boxShadow: '0 4px 14px rgba(54,60,70,0.18)',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#CFB6A8' }} />
                        <span>Reserving Chauffeur Transit...</span>
                      </>
                    ) : (
                      <>
                        <span>CONFIRM PRIVATE WALKTHROUGH</span>
                        <ArrowRight className="w-4 h-4" style={{ color: '#CFB6A8' }} />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="booking-success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-6 space-y-6"
                >
                  {/* Success checkmark — Dark Vanilla */}
                  <div
                    className="mx-auto w-16 h-16 flex items-center justify-center"
                    style={{ background: '#CFB6A8', borderRadius: '50%', boxShadow: '0 4px 16px rgba(207,182,168,0.30)' }}
                  >
                    <Check className="w-8 h-8 stroke-[2.5]" style={{ color: '#FFFFFF' }} />
                  </div>

                  <div className="space-y-2">
                    <h4
                      className="text-xl font-medium tracking-tight"
                      style={{ fontFamily: "'Fraunces', 'Playfair Display', serif", color: '#363C46' }}
                    >
                      Private Tour Confirmed
                    </h4>
                    <p className="text-xs font-normal leading-relaxed max-w-sm mx-auto" style={{ color: '#5D6472' }}>
                      Thank you, <span className="font-bold" style={{ color: '#363C46' }}>{formData.name}</span>. Your private walkthrough for{' '}
                      <span className="font-bold" style={{ color: '#CFB6A8' }}>{formData.property}</span> has been registered for{' '}
                      <span className="font-bold" style={{ color: '#363C46' }}>{formData.date}</span> at{' '}
                      <span className="font-bold" style={{ color: '#363C46' }}>{formData.time}</span>.
                    </p>
                    <p className="text-[11px] font-normal pt-2" style={{ color: '#5D6472' }}>
                      Our senior wealth advisory manager will contact you at{' '}
                      <span className="font-bold" style={{ color: '#363C46' }}>{formData.phone}</span> to coordinate your chauffeur transit.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={closeBookModal}
                      className="w-full sm:w-auto px-8 py-3 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
                      style={{
                        background: '#363C46',
                        color: '#FFFFFF',
                        borderRadius: 6,
                        boxShadow: '0 4px 14px rgba(54,60,70,0.16)',
                      }}
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookSiteVisitModal;
