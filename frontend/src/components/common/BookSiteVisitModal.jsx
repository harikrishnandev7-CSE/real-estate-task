import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Phone, User, Mail, Building, Clock, Check, X, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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

  const fieldBase = 'w-full bg-[#F7F6F3] border focus:border-[#C9A96E] outline-none rounded-xl py-3.5 text-xs text-[#0B0B0B] font-bold placeholder-[#888888] transition-all font-sans';
  const fieldErr  = 'border-red-500';
  const fieldOk   = 'border-[rgba(22,22,26,0.15)]';

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
            style={{ background: 'rgba(14,14,16,0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && closeBookModal()}
          >
            <div
              className="relative w-full max-w-lg p-6 sm:p-8 font-sans my-auto rounded-2xl bg-white border border-[rgba(201,169,110,0.30)] shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            >
              {/* Close Icon Button */}
              <button
                onClick={closeBookModal}
                className="absolute top-5 right-5 p-2 rounded-full text-[#555555] hover:text-[#0B0B0B] hover:bg-[#F7F6F3] transition-all cursor-pointer z-10"
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
                    <div className="border-b border-[rgba(201,169,110,0.20)] pb-4 space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold block text-[#C9A96E]">
                        IMPERIA ESTATES PRIVATE CONCIERGE
                      </span>
                      <h3
                        className="text-2xl font-bold tracking-tight text-[#0B0B0B]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Book Private Site Visit
                      </h3>
                      <p className="text-xs font-semibold text-[#555555] leading-relaxed">
                        Schedule a chauffeur-driven private estate tour with our senior property advisors.
                      </p>
                    </div>

                    {/* Property Name */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[#555555]">
                        Selected Estate / Project
                      </label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A96E]" />
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
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[#555555]">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A96E]" />
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
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#555555]">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C9A96E]" />
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
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#555555]">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C9A96E]" />
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
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#555555]">
                          Preferred Date *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C9A96E]" />
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
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#555555]">
                          Preferred Time *
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C9A96E]" />
                          <select
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className={`${fieldBase} pl-10 pr-3 cursor-pointer`}
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
                      whileHover={isSubmitting ? {} : { scale: 1.01 }}
                      whileTap={isSubmitting ? {} : { scale: 0.98 }}
                      className="w-full py-4 bg-[#0E0E10] hover:bg-[#C9A96E] text-[#F4F1EA] hover:text-[#0B0B0B] font-extrabold text-xs tracking-[0.2em] uppercase rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 border border-[rgba(201,169,110,0.35)] mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#C9A96E]" />
                          <span>Reserving Chauffeur Transit...</span>
                        </>
                      ) : (
                        <>
                          <span>CONFIRM PRIVATE WALKTHROUGH</span>
                          <ArrowRight className="w-4 h-4" />
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
                    {/* Success checkmark — IMPERIA Gold */}
                    <div
                      className="mx-auto w-16 h-16 flex items-center justify-center bg-[#C9A96E] text-[#0B0B0B] rounded-full shadow-md"
                    >
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>

                    <div className="space-y-2 font-sans">
                      <h4
                        className="text-2xl font-bold tracking-tight text-[#0B0B0B]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Private Tour Confirmed
                      </h4>
                      <p className="text-xs sm:text-sm font-semibold leading-relaxed max-w-sm mx-auto text-[#555555]">
                        Thank you, <span className="font-extrabold text-[#0B0B0B]">{formData.name}</span>. Your private walkthrough for{' '}
                        <span className="font-extrabold text-[#C9A96E]">{formData.property}</span> has been registered for{' '}
                        <span className="font-extrabold text-[#0B0B0B]">{formData.date}</span> at{' '}
                        <span className="font-extrabold text-[#0B0B0B]">{formData.time}</span>.
                      </p>
                      <p className="text-xs font-semibold text-[#555555] pt-2">
                        Our senior wealth advisory manager will contact you at{' '}
                        <span className="font-extrabold text-[#0B0B0B]">{formData.phone}</span> to coordinate your chauffeur transit.
                      </p>
                    </div>

                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={closeBookModal}
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#0E0E10] text-[#F4F1EA] hover:bg-[#C9A96E] hover:text-[#0B0B0B] font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-md cursor-pointer transition-all border border-[rgba(201,169,110,0.35)]"
                      >
                        Done
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookSiteVisitModal;
