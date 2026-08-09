import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useApp } from '../context/AppContext';

const OnboardingWelcomePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const userName = currentUser?.name || 'Valued Member';

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#E0EEE9] text-[#363C46] flex items-center justify-center font-sans relative overflow-hidden">
      
      {/* Ambient Background Hero */}
      <div className="absolute inset-0 z-0">
        <ImageWithSkeleton
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="Luxury Architecture"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#E0EEE9] via-[#E0EEE9]/90 to-[#E0EEE9]" />
      </div>

      <div className="max-w-xl w-full mx-auto px-6 relative z-10 text-center space-y-8">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[rgba(93,100,114,0.15)] text-[#CFB6A8] text-xs font-bold uppercase tracking-[0.2em] shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#CFB6A8]" />
          ONBOARDING COMPLETE
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-4 font-sans"
        >
          <h1
            className="text-4xl sm:text-5xl font-medium text-[#363C46] tracking-tight leading-tight"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            Welcome to IMPERIA ESTATES, <br />
            <span className="text-[#CFB6A8]">{userName}</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5D6472] font-normal max-w-md mx-auto leading-relaxed">
            Your luxury property experience is now personalized. We've prepared exclusive recommendations based on your preferences.
          </p>
        </motion.div>

        {/* Criteria Confirmation Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="p-6 sm:p-8 rounded-xl bg-white border border-[rgba(93,100,114,0.15)] text-left space-y-4 font-sans shadow-[0_12px_32px_rgba(54,60,70,0.06)]"
        >
          <span className="text-[10px] uppercase tracking-wider text-[#CFB6A8] font-bold block">
            YOUR PERSONALIZED PRIVILEGE PROFILE
          </span>
          <div className="grid grid-cols-2 gap-3 text-xs text-[#5D6472]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#CFB6A8] shrink-0 stroke-[2]" />
              <span>Purpose: <strong className="text-[#363C46] font-bold">{currentUser?.purpose || 'Buy'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#CFB6A8] shrink-0 stroke-[2]" />
              <span>Budget: <strong className="text-[#363C46] font-bold">{currentUser?.budget || '₹2Cr–₹5Cr'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <CheckCircle2 className="w-4 h-4 text-[#CFB6A8] shrink-0 stroke-[2]" />
              <span>Types: <strong className="text-[#363C46] font-bold">{currentUser?.propertyTypes?.join(', ') || 'Villas'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <CheckCircle2 className="w-4 h-4 text-[#CFB6A8] shrink-0 stroke-[2]" />
              <span>Locations: <strong className="text-[#363C46] font-bold">{currentUser?.locations?.join(', ') || 'ECR, Chennai'}</strong></span>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-[#363C46] hover:bg-[#1A1A1A] text-white font-bold text-xs tracking-[0.2em] uppercase rounded-lg shadow-sm cursor-pointer flex items-center justify-center gap-3 transition-all duration-300"
          >
            <span>Explore Dashboard</span>
            <ArrowRight className="w-4 h-4 text-[#CFB6A8]" />
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default OnboardingWelcomePage;
