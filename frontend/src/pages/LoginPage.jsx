import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser, login, showToast } = useApp();
  const doLogin = loginUser || login;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email format.";
    }

    if (!password) {
      errs.password = "Password is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await doLogin({ email, password });
      setIsSubmitting(false);

      const loggedUser = res?.user || res;
      if (loggedUser) {
        if (loggedUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    showToast("Password reset instructions sent to your email address.");
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F7F6F3] text-[#0B0B0B] flex items-center justify-center font-sans">
      <div className="max-w-md w-full mx-auto px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96E] font-extrabold block">
            IMPERIA PRIVATE ACCESS
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#0B0B0B] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-semibold">
            Sign in to access your curated portfolio and saved properties.
          </p>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-2xl bg-white border border-[rgba(201,169,110,0.30)] shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-6">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#555555] font-bold block">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@domain.com"
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
            <label className="text-[10px] uppercase tracking-wider text-[#555555] font-bold block">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#F7F6F3] border ${errors.password ? 'border-red-500' : 'border-[rgba(22,22,26,0.15)]'} rounded-xl pl-10 pr-10 py-3.5 text-xs text-[#0B0B0B] font-bold placeholder-[#888888] outline-none focus:border-[#C9A96E] focus:bg-white transition-all`}
              />
              <Lock className="w-4 h-4 text-[#C9A96E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555555] hover:text-[#0B0B0B] focus:outline-none cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-[#C9A96E]" /> : <Eye className="w-4 h-4 text-[#C9A96E]" />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs font-sans">
            <label className="flex items-center gap-2 cursor-pointer text-[#555555] hover:text-[#0B0B0B] font-semibold">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#C9A96E] cursor-pointer"
              />
              Remember Me
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#C9A96E] hover:underline text-xs cursor-pointer font-bold"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#0E0E10] hover:bg-[#C9A96E] text-[#F4F1EA] hover:text-[#0B0B0B] font-extrabold text-xs tracking-[0.2em] uppercase rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 border border-[rgba(201,169,110,0.35)]"
          >
            <span>{isSubmitting ? 'VERIFYING CREDENTIALS...' : 'LOGIN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-[#555555] font-semibold">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#C9A96E] hover:underline font-bold">Create Account</Link>
          </p>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
