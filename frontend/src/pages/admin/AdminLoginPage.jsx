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
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] flex items-center justify-center font-sans px-6 py-12">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <ImperiaLogo layout="lockup" variant="dark" height={36} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#CFB6A8] font-bold block font-sans">
            CONTROL PANEL SECURITY GATE
          </span>
          <h1
            className="text-2xl md:text-3xl font-bold text-[#363C46] tracking-tight"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            Admin Authentication
          </h1>
          <p className="text-xs text-[#5D6472] font-normal leading-relaxed max-w-sm mx-auto font-sans">
            Authorized real estate administrators and consultants only.
          </p>
        </div>

        {/* Dedicated Admin Login Card */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-xl bg-white border border-[rgba(93,100,114,0.15)] shadow-[0_12px_32px_rgba(54,60,70,0.06)] space-y-6 font-sans">
          
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[rgba(207,182,168,0.12)] border border-[rgba(207,182,168,0.30)] text-[#363C46]">
            <ShieldCheck className="w-5 h-5 text-[#CFB6A8] shrink-0" />
            <p className="text-xs font-bold leading-tight">
              Admin Portal Gateway <span className="text-[10px] text-[#5D6472] font-normal block">Use credentials admin@imperiaestates.com / admin1234</span>
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#5D6472] font-bold block">
              Admin Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@imperiaestates.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-[#E0EEE9]/50 border ${errors.email ? 'border-red-500' : 'border-[rgba(93,100,114,0.20)]'} rounded-lg pl-10 pr-4 py-3 text-xs text-[#363C46] font-medium placeholder-[#5D6472]/60 outline-none focus:border-[#CFB6A8]`}
              />
              <Mail className="w-4 h-4 text-[#CFB6A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#5D6472] font-bold block">Password *</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#E0EEE9]/50 border ${errors.password ? 'border-red-500' : 'border-[rgba(93,100,114,0.20)]'} rounded-lg pl-10 pr-4 py-3 text-xs text-[#363C46] font-medium placeholder-[#5D6472]/60 outline-none focus:border-[#CFB6A8]`}
              />
              <Lock className="w-4 h-4 text-[#CFB6A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#363C46] hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Authenticating...' : 'Authorize Admin Access'}
            <ArrowRight className="w-4 h-4 text-[#CFB6A8]" />
          </button>
        </form>

        <div className="text-center">
          <Link to="/" className="text-xs text-[#5D6472] hover:text-[#363C46] font-bold uppercase tracking-wider transition-colors">
            ← Back to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
