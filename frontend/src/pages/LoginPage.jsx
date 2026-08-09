import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim()) errs.email = 'Email address is required';
    if (!password) errs.password = 'Password is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await loginUser({ email, password });
      setIsSubmitting(false);
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user?.role === 'consultant') {
        navigate('/consultant/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    showToast("Password reset instructions sent to your email address.");
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F4F1EA] text-[#1A1A1A] flex items-center justify-center font-sans">
      <div className="max-w-md w-full mx-auto px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5A623] font-bold block">
            VIP LOGIN
          </span>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-[#8A8A85] font-normal">
            Sign in to access your curated portfolio and saved properties.
          </p>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)] space-y-6">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@domain.com"
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
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#F4F1EA] border ${errors.password ? 'border-red-500' : 'border-[#E8E4DA]'} rounded-xl pl-10 pr-10 py-3 text-xs text-[#1A1A1A] font-medium placeholder-[#8A8A85] outline-none focus:border-[#F5A623]`}
              />
              <Lock className="w-4 h-4 text-[#F5A623] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8A85] hover:text-[#1A1A1A] focus:outline-none cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-[#F5A623]" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs font-sans">
            <label className="flex items-center gap-2 cursor-pointer text-[#8A8A85] hover:text-[#1A1A1A] font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#F5A623] cursor-pointer"
              />
              Remember Me
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#F5A623] hover:underline text-xs cursor-pointer font-bold"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs tracking-[0.2em] uppercase rounded-full shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
          >
            <span>{isSubmitting ? 'VERIFYING CREDENTIALS...' : 'LOGIN'}</span>
            <ArrowRight className="w-4 h-4 text-[#F5A623]" />
          </button>

          <p className="text-center text-xs text-[#8A8A85] font-normal">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#F5A623] hover:underline font-bold">Create Account</Link>
          </p>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
