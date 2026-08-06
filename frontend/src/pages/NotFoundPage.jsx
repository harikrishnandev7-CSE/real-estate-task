import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, Home } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F4F1EA] text-[#1A1A1A] flex items-center justify-center font-sans">
      <div className="max-w-md w-full mx-auto px-6 text-center space-y-8">
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-white border border-[#E8E4DA] text-[#F5A623] flex items-center justify-center mx-auto shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
        >
          <Compass className="w-10 h-10 stroke-[1.5] animate-spin-slow" />
        </motion.div>

        <div className="space-y-3 font-sans">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5A623] font-bold block">
            404 — PAGE NOT DISCOVERED
          </span>
          <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Off-Grid Destination
          </h1>
          <p className="text-xs text-[#8A8A85] font-normal leading-relaxed max-w-sm mx-auto">
            The page or property coordinate you are looking for has moved or does not exist in our active portfolio index.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 font-sans">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-4 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs tracking-[0.2em] uppercase rounded-full shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Home className="w-4 h-4 text-[#F5A623]" />
            Return Home
          </button>
          <button
            onClick={() => navigate('/buy')}
            className="flex-1 py-4 bg-white border border-[#E8E4DA] hover:border-[#F5A623] text-[#1A1A1A] font-bold text-xs tracking-[0.2em] uppercase rounded-full shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
          >
            Browse Estates
            <ArrowRight className="w-4 h-4 text-[#F5A623]" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
