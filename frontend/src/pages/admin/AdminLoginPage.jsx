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
      showToast("Authorized into IMPERIA Admin Control Panel");
      navigate('/admin/dashboard');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] flex items-center justify-center font-sans px-6 py-12">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <ImperiaLogo layout="lockup" variant="dark" height={36} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5A623] font-extrabold block">
            CONTROL PANEL SECURITY GATE
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs text-[#8A8A85] font-normal leading-relaxed max-w-sm mx-auto">
            Authorized real estate administrators and consultants only.
          </p>
        </div>

        {/* Dedicated Admin Login Card */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)] space-y-6">
          
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[#1A1A1A]">
            <ShieldCheck className="w-5 h-5 text-[#F5A623] shrink-0" />
            <p className="text-xs font-bold leading-tight">
              Admin Portal Gateway <span className="text-[10px] text-[#8A8A85] font-normal block">Use credentials admin@imperiaestates.com / Admin@123456</span>
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block">
              Admin Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@imperiaestates.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-[#F4F1EA] border ${errors.email ? 'border-red-500' : 'border-[#E8E4DA]'} rounded-xl pl-10 pr-4 py-3 text-xs text-[#1A1A1A] font-medium placeholder-[#8A8A85] outline-none focus:border-[#F5A623]`}
              />
              <Mail className="w-4 h-4 text-[#F5A623] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block">Password *</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#F4F1EA] border ${errors.password ? 'border-red-500' : 'border-[#E8E4DA]'} rounded-xl pl-10 pr-4 py-3 text-xs text-[#1A1A1A] font-medium placeholder-[#8A8A85] outline-none focus:border-[#F5A623]`}
              />
              <Lock className="w-4 h-4 text-[#F5A623] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs font-sans">
            <label className="flex items-center gap-2 cursor-pointer text-[#8A8A85] hover:text-[#1A1A1A] font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#F5A623] cursor-pointer"
              />
              Remember Admin Session
            </label>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs tracking-[0.2em] uppercase rounded-full shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
          >
            <span>{isSubmitting ? 'AUTHENTICATING...' : 'ACCESS ADMIN CONTROL PANEL'}</span>
            <ArrowRight className="w-4 h-4 text-[#F5A623]" />
          </button>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-[#8A8A85] hover:text-[#1A1A1A] transition-colors underline font-medium">
              Return to Customer Website
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdminLoginPage;
