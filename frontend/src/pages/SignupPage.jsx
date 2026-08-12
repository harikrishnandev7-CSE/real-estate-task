import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signupUser } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    state: 'Tamil Nadu',
    city: 'Chennai',
    purpose: 'Buy',
    propertyTypes: ['Villa'],
    budget: '₹2Cr–₹5Cr',
    locations: ['ECR', 'Chennai']
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid email is required';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errs.phone = 'Mobile number must be exactly 10 digits';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signupUser({
        fullName: formData.name,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        city: formData.city,
        state: formData.state,
      });
      setIsSubmitting(false);
      navigate('/onboarding/preferences');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F7F6F3] text-[#0B0B0B] flex items-center justify-center font-sans">
      <div className="max-w-md w-full mx-auto px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96E] font-extrabold block">
            STEP 1 OF 3 — PRIVILEGE ACCESS
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#0B0B0B] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-semibold max-w-sm mx-auto leading-relaxed">
            Gain bespoke access to off-market luxury listings, advisory services, and private estate tours.
          </p>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-2xl bg-white border border-[rgba(201,169,110,0.30)] shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-5">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#555555] font-bold block">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Vikramaditya Roy"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full bg-[#F7F6F3] border ${errors.name ? 'border-red-500' : 'border-[rgba(22,22,26,0.15)]'} rounded-xl pl-10 pr-4 py-3.5 text-xs text-[#0B0B0B] font-bold placeholder-[#888888] outline-none focus:border-[#C9A96E] focus:bg-white transition-all`}
              />
              <User className="w-4 h-4 text-[#C9A96E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#555555] font-bold block">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full bg-[#F7F6F3] border ${errors.email ? 'border-red-500' : 'border-[rgba(22,22,26,0.15)]'} rounded-xl pl-10 pr-4 py-3.5 text-xs text-[#0B0B0B] font-bold placeholder-[#888888] outline-none focus:border-[#C9A96E] focus:bg-white transition-all`}
              />
              <Mail className="w-4 h-4 text-[#C9A96E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#555555] font-bold block">Mobile Number (10 digits) *</label>
            <div className="relative">
              <input
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) {
                    setFormData({ ...formData, phone: val });
                  }
                }}
                className={`w-full bg-[#F7F6F3] border ${errors.phone ? 'border-red-500' : 'border-[rgba(22,22,26,0.15)]'} rounded-xl pl-10 pr-4 py-3.5 text-xs text-[#0B0B0B] font-bold placeholder-[#888888] outline-none focus:border-[#C9A96E] focus:bg-white transition-all`}
              />
              <Phone className="w-4 h-4 text-[#C9A96E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#555555] font-bold block">Password *</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full bg-[#F7F6F3] border ${errors.password ? 'border-red-500' : 'border-[rgba(22,22,26,0.15)]'} rounded-xl pl-10 pr-4 py-3.5 text-xs text-[#0B0B0B] font-bold placeholder-[#888888] outline-none focus:border-[#C9A96E] focus:bg-white transition-all`}
              />
              <Lock className="w-4 h-4 text-[#C9A96E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#555555] font-bold block">Confirm Password *</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full bg-[#F7F6F3] border ${errors.confirmPassword ? 'border-red-500' : 'border-[rgba(22,22,26,0.15)]'} rounded-xl pl-10 pr-4 py-3.5 text-xs text-[#0B0B0B] font-bold placeholder-[#888888] outline-none focus:border-[#C9A96E] focus:bg-white transition-all`}
              />
              <Lock className="w-4 h-4 text-[#C9A96E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold">{errors.confirmPassword}</p>}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#0E0E10] hover:bg-[#C9A96E] text-[#F4F1EA] hover:text-[#0B0B0B] font-extrabold text-xs tracking-[0.2em] uppercase rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 border border-[rgba(201,169,110,0.35)] mt-2"
          >
            <span>{isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-[#555555] font-semibold pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C9A96E] hover:underline font-bold">LOGIN</Link>
          </p>
        </form>

      </div>
    </div>
  );
};

export default SignupPage;
