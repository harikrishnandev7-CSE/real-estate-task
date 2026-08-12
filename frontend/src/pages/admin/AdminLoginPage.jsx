import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ImperiaLogo from '../../components/ImperiaLogo';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginUser, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim()) errs.email = 'Admin email address is required';
    if (!password) errs.password = 'Password is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await loginUser({ email, password });
      setIsSubmitting(false);

      if (user?.role !== 'admin') {
        showToast('Access denied. Admin credentials required.', 'error');
        return;
      }

      showToast('Authorized into IMPERIA Admin Control Panel');
      navigate('/admin/dashboard');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#0B0B0B] flex items-center justify-center font-sans px-6 py-12">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <ImperiaLogo layout="lockup" variant="dark" height={36} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-extrabold block font-sans">
            CONTROL PANEL SECURITY GATE
          </span>
          <h1
            className="text-2xl md:text-3xl font-bold text-[#0B0B0B] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Admin Authentication
          </h1>
          <p className="text-xs text-[#6B6B6B] font-semibold leading-relaxed max-w-sm mx-auto font-sans">
            Authorized real estate administrators and consultants only.
          </p>
        </div>

        {/* Dedicated Admin Login Card */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-2xl bg-white border border-[rgba(201,169,110,0.30)] shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-6 font-sans">
          
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[#0B0B0B]">
            <ShieldCheck className="w-5 h-5 text-[#C9A96E] shrink-0" />
            <p className="text-xs font-bold leading-tight">
              Admin Portal Gateway <span className="text-[10px] text-[#6B6B6B] font-semibold block mt-0.5">Use credentials admin@imperiaestates.com / admin1234</span>
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-bold block">
              Admin Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@imperiaestates.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-[#F7F6F3] border ${errors.email ? 'border-red-500' : 'border-[rgba(22,22,26,0.15)]'} rounded-xl pl-10 pr-4 py-3.5 text-xs text-[#0B0B0B] font-bold placeholder-[#888888] outline-none focus:border-[#C9A96E] focus:bg-white transition-all`}
              />
              <Mail className="w-4 h-4 text-[#C9A96E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-bold block">Password *</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#F7F6F3] border ${errors.password ? 'border-red-500' : 'border-[rgba(22,22,26,0.15)]'} rounded-xl pl-10 pr-4 py-3.5 text-xs text-[#0B0B0B] font-bold placeholder-[#888888] outline-none focus:border-[#C9A96E] focus:bg-white transition-all`}
              />
              <Lock className="w-4 h-4 text-[#C9A96E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#0E0E10] hover:bg-[#C9A96E] text-[#F4F1EA] hover:text-[#0B0B0B] font-extrabold text-xs tracking-[0.2em] uppercase rounded-xl shadow-md cursor-pointer transition-all duration-300 border border-[rgba(201,169,110,0.35)] flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'AUTHENTICATING...' : 'AUTHORIZE ADMIN ACCESS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center">
          <Link to="/" className="text-xs text-[#6B6B6B] hover:text-[#C9A96E] font-bold uppercase tracking-wider transition-colors">
            ← Back to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
