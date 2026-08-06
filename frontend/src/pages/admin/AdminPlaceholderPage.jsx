import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, Sparkles } from 'lucide-react';

const AdminPlaceholderPage = ({ title = "Section", phase = "Next Phase" }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[450px] bg-white border border-[#E8E4DA] rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] font-sans">
      <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] flex items-center justify-center shadow-xs">
        <Clock className="w-8 h-8 stroke-[2]" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5A623] font-extrabold block">
          BUILD IN PROGRESS · {phase.toUpperCase()}
        </span>
        <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
          {title} Page
        </h2>
        <p className="text-xs text-[#8A8A85] leading-relaxed">
          The scaffolding and route links for <span className="font-bold text-[#1A1A1A]">{title}</span> are active. The full functional workflow for this module will be built in {phase}.
        </p>
      </div>

      <button
        onClick={() => navigate('/admin')}
        className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4 text-[#F5A623]" />
        <span>Return to Admin Dashboard</span>
      </button>
    </div>
  );
};

export default AdminPlaceholderPage;
