import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building, 
  Users, 
  Calendar, 
  TrendingUp, 
  PlusCircle, 
  FileText, 
  ArrowRight, 
  Eye, 
  Heart, 
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  UserCheck
} from 'lucide-react';
import KPICard from '../../components/admin/primitives/KPICard';
import StatusChip from '../../components/admin/primitives/StatusChip';
import { SegmentedControl } from '../../components/admin/primitives/FormField';
import { useApp } from '../../context/AppContext';

const chartDataMap = {
  '30d': {
    labels: ['W1', 'W2', 'W3', 'W4'],
    points: [30, 45, 60, 85],
    totalEnquiries: 142,
    conversion: '14.2%'
  },
  '60d': {
    labels: ['M1-W1', 'M1-W3', 'M2-W1', 'M2-W3'],
    points: [25, 40, 70, 110],
    totalEnquiries: 284,
    conversion: '16.5%'
  },
  '90d': {
    labels: ['M1', 'M2', 'M3'],
    points: [20, 50, 95, 160],
    totalEnquiries: 468,
    conversion: '18.1%'
  }
};

const mockActivities = [
  { id: 1, title: 'New Customer Signup', desc: 'Rajesh Subramaniam joined VIP Access', time: '12 mins ago', type: 'user' },
  { id: 2, title: 'Site Visit Booked', desc: 'Tour booked for The ECR Beachfront Villa', time: '45 mins ago', type: 'visit' },
  { id: 3, title: 'Enquiry Received', desc: 'Ananya requested floor plan for Skyline Towers', time: '2 hours ago', type: 'enquiry' },
  { id: 4, title: 'Listing Published', desc: 'Grand Vista Mansion marked as Published', time: '5 hours ago', type: 'property' }
];

const mockUpcomingVisits = [
  { id: 'v1', name: 'Vikramaditya Roy', property: 'The ECR Beachfront Villa', time: 'Today, 10:30 AM', consultant: 'Vikram M.', status: 'Confirmed' },
  { id: 'v2', name: 'Priya Sundaram', property: 'Golden Meadows', time: 'Today, 03:00 PM', consultant: 'Ananya D.', status: 'Confirmed' },
  { id: 'v3', name: 'Karthik Raja', property: 'The Ritz-Carlton Residences', time: 'Tomorrow, 11:00 AM', consultant: 'Siddharth V.', status: 'Scheduled' },
  { id: 'v4', name: 'Meera Nambiar', property: 'IMPERIA Skyline Towers', time: 'Tomorrow, 02:30 PM', consultant: 'Vikram M.', status: 'Scheduled' },
  { id: 'v5', name: 'Arun Prakash', property: 'Kalapatti Commercial Showroom', time: 'Aug 05, 04:00 PM', consultant: 'Ananya D.', status: 'Scheduled' }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { properties = [], siteVisits = [] } = useApp();

  const [chartRange, setChartRange] = useState('30d');

  const activePropertiesCount = useMemo(() => {
    return properties.filter(p => p.status !== 'Archived').length || 12;
  }, [properties]);

  const topListings = useMemo(() => {
    return properties.slice(0, 5).map((p, idx) => ({
      ...p,
      views: 1240 - idx * 180,
      saves: 142 - idx * 22,
      enquiries: 28 - idx * 4
    }));
  }, [properties]);

  const currentChart = chartDataMap[chartRange];
  const renderTrendAreaChart = () => {
    const pts = currentChart.points;
    const width = 600;
    const height = 180;
    const min = Math.min(...pts) * 0.8;
    const max = Math.max(...pts) * 1.1;
    const range = max - min || 1;

    const coords = pts.map((val, idx) => {
      const x = (idx / (pts.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 20) - 10;
      return `${x},${y}`;
    });

    const linePath = `M ${coords.join(' L ')}`;
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible font-sans">
        <defs>
          <linearGradient id="vanillaAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CFB6A8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#CFB6A8" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <line x1="0" y1="30" x2={width} y2="30" stroke="rgba(93,100,114,0.15)" strokeDasharray="4 4" />
        <line x1="0" y1="90" x2={width} y2="90" stroke="rgba(93,100,114,0.15)" strokeDasharray="4 4" />
        <line x1="0" y1="150" x2={width} y2="150" stroke="rgba(93,100,114,0.15)" strokeDasharray="4 4" />

        <path d={areaPath} fill="url(#vanillaAreaGrad)" />
        <path d={linePath} fill="none" stroke="#CFB6A8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {coords.map((coord, idx) => {
          const [cx, cy] = coord.split(',').map(Number);
          return (
            <g key={`dot-${idx}-${coord}`}>
              <circle cx={cx} cy={cy} r="5" fill="#363C46" stroke="#CFB6A8" strokeWidth="2.5" />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* ── 1. KPI CARDS GRID (4 Cards) ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KPICard
          title="Active Listings"
          value={activePropertiesCount}
          icon={Building}
          delta={{ value: '+12.5%', positive: true }}
          sparkline={[8, 9, 10, 11, 12, 14]}
        />
        <KPICard
          title="Total Registered Clients"
          value="1,480"
          icon={Users}
          delta={{ value: '+8.2%', positive: true }}
          sparkline={[1200, 1310, 1380, 1420, 1480]}
        />
        <KPICard
          title="Pending Site Visits"
          value={siteVisits.length || 8}
          icon={Calendar}
          delta={{ value: '+4 this week', positive: true }}
          sparkline={[3, 5, 4, 6, 8]}
        />
        <KPICard
          title="Portfolio Valuation"
          value="₹840 Cr"
          icon={TrendingUp}
          delta={{ value: '+18.4%', positive: true }}
          sparkline={[650, 720, 790, 840]}
        />
      </div>

      {/* ── 2. MAIN SECTION: ANALYTICS & RECENT ACTIVITY ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Analytics Chart */}
        <div className="lg:col-span-8 bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-6 sm:p-7 shadow-[0_12px_32px_rgba(54,60,70,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(93,100,114,0.15)] pb-5">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#CFB6A8] font-bold block font-sans">
                PERFORMANCE METRICS
              </span>
              <h3
                className="text-xl font-bold text-[#363C46] tracking-tight"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                Lead Acquisition &amp; Traffic Trends
              </h3>
            </div>

            <SegmentedControl
              options={[
                { value: '30d', label: '30 Days' },
                { value: '60d', label: '60 Days' },
                { value: '90d', label: '90 Days' }
              ]}
              value={chartRange}
              onChange={setChartRange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-[#E0EEE9]/40 p-4 rounded-lg border border-[rgba(93,100,114,0.15)] font-sans">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#5D6472] font-bold">Total Inquiries</p>
              <p
                className="text-2xl font-bold text-[#363C46]"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                {currentChart.totalEnquiries}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#5D6472] font-bold">Conversion Rate</p>
              <p
                className="text-2xl font-bold text-[#CFB6A8]"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                {currentChart.conversion}
              </p>
            </div>
          </div>

          <div className="pt-2">
            {renderTrendAreaChart()}
          </div>
        </div>

        {/* Right Column: Quick Actions & Recent Activity */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-6 shadow-[0_12px_32px_rgba(54,60,70,0.06)] space-y-4">
            <h4
              className="text-sm font-bold text-[#363C46] uppercase tracking-wider"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Control Actions
            </h4>

            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/admin/properties/new')}
                className="w-full py-3 px-4 bg-[#363C46] hover:bg-[#1A1A1A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all shadow-xs cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#CFB6A8]" />
                  Add New Property
                </span>
                <ArrowRight className="w-4 h-4 text-[#CFB6A8]" />
              </button>

              <button
                onClick={() => navigate('/admin/visits')}
                className="w-full py-3 px-4 bg-white border border-[rgba(93,100,114,0.20)] hover:border-[#363C46] text-[#363C46] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all shadow-xs cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#CFB6A8]" />
                  Schedule Site Visit
                </span>
                <ArrowRight className="w-4 h-4 text-[#CFB6A8]" />
              </button>
            </div>
          </div>

          {/* Activity Log Feed */}
          <div className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-6 shadow-[0_12px_32px_rgba(54,60,70,0.06)] space-y-4">
            <div className="flex justify-between items-center border-b border-[rgba(93,100,114,0.15)] pb-3">
              <h4
                className="text-xs font-bold text-[#363C46] uppercase tracking-wider"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                Real-Time Activity
              </h4>
              <span className="text-[10px] text-[#CFB6A8] font-bold">Live Stream</span>
            </div>

            <div className="space-y-4 text-xs font-sans">
              {mockActivities.map(act => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#CFB6A8] mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-[#363C46] text-xs">{act.title}</p>
                    <p className="text-[11px] text-[#5D6472]">{act.desc}</p>
                    <span className="text-[10px] text-[#5D6472]/70 font-medium block pt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
