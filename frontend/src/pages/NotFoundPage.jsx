import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, Home } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#E0EEE9] text-[#363C46] flex items-center justify-center font-sans">
      <div className="max-w-md w-full mx-auto px-6 text-center space-y-8">
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-white border border-[rgba(93,100,114,0.15)] text-[#CFB6A8] flex items-center justify-center mx-auto shadow-[0_12px_32px_rgba(54,60,70,0.06)]"
        >
          <Compass className="w-10 h-10 stroke-[1.5] animate-spin-slow" />
        </motion.div>

        <div className="space-y-3 font-sans">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#CFB6A8] font-bold block">
            404 — PAGE NOT DISCOVERED
          </span>
          <h1
            className="text-4xl font-medium text-[#363C46] tracking-tight"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            Off-Grid Destination
          </h1>
          <p className="text-xs text-[#5D6472] font-normal leading-relaxed max-w-sm mx-auto">
            The page or property coordinate you are looking for has moved or does not exist in our active portfolio index.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 font-sans">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3.5 bg-[#363C46] hover:bg-[#1A1A1A] text-white font-bold text-xs tracking-[0.15em] uppercase rounded-lg shadow-sm cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Home className="w-4 h-4 text-[#CFB6A8]" />
            Return Home
          </button>
          <button
            onClick={() => navigate('/buy')}
            className="flex-1 py-3.5 bg-white border border-[rgba(93,100,114,0.20)] hover:border-[#CFB6A8] text-[#363C46] font-bold text-xs tracking-[0.15em] uppercase rounded-lg shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
          >
            Browse Estates
            <ArrowRight className="w-4 h-4 text-[#CFB6A8]" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
