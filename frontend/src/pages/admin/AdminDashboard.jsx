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

  // Compute active properties count
  const activePropertiesCount = useMemo(() => {
    return properties.filter(p => p.status !== 'Archived').length || 12;
  }, [properties]);

  // Top performing listings mock calculations
  const topListings = useMemo(() => {
    return properties.slice(0, 5).map((p, idx) => ({
      ...p,
      views: 1240 - idx * 180,
      saves: 142 - idx * 22,
      enquiries: 28 - idx * 4
    }));
  }, [properties]);

  // SVG Trend Chart Path Generator
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
          <linearGradient id="amberAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5A623" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        <line x1="0" y1="30" x2={width} y2="30" stroke="#E8E4DA" strokeDasharray="4 4" />
        <line x1="0" y1="90" x2={width} y2="90" stroke="#E8E4DA" strokeDasharray="4 4" />
        <line x1="0" y1="150" x2={width} y2="150" stroke="#E8E4DA" strokeDasharray="4 4" />

        {/* Gradient Area */}
        <path d={areaPath} fill="url(#amberAreaGrad)" />

        {/* Trend Line */}
        <path d={linePath} fill="none" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {coords.map((coord, idx) => {
          const [cx, cy] = coord.split(',').map(Number);
          return (
            <g key={`dot-${idx}-${coord}`}>
              <circle cx={cx} cy={cy} r="5" fill="#1A1A1A" stroke="#F5A623" strokeWidth="2.5" />
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
          delta={{ value: '+12.4%', positive: true }}
          sparkline={[8, 9, 10, 11, 10, 12, activePropertiesCount]}
        />
        <KPICard
          title="New Enquiries (7d)"
          value={currentChart.totalEnquiries}
          icon={MessageSquare}
          delta={{ value: '+18.5%', positive: true }}
          sparkline={[20, 28, 35, 42, 38, 40, currentChart.totalEnquiries]}
        />
        <KPICard
          title="Site Visits This Week"
          value={siteVisits.length || 18}
          icon={Calendar}
          delta={{ value: '+24.1%', positive: true }}
          sparkline={[10, 12, 14, 16, 18, 20, 24]}
        />
        <KPICard
          title="Conversion Rate"
          value={currentChart.conversion}
          icon={TrendingUp}
          delta={{ value: '+3.8%', positive: true }}
          sparkline={[10, 11, 12, 13, 14, 14.2, 15]}
        />
      </div>

      {/* ── 2. QUICK ACTION TILES ROW ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/admin/properties/new')}
          className="bg-white border border-[#E8E4DA] hover:border-[#F5A623] rounded-2xl p-4 flex items-center gap-3 transition-all group cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.04)]"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 text-[#F5A623] flex items-center justify-center shrink-0 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
            <PlusCircle className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="text-left font-sans">
            <span className="text-xs font-extrabold text-[#1A1A1A] block tracking-tight">Add Property</span>
            <span className="text-[10px] text-[#8A8A85]">New luxury listing</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/site-visits')}
          className="bg-white border border-[#E8E4DA] hover:border-[#F5A623] rounded-2xl p-4 flex items-center gap-3 transition-all group cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.04)]"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 text-[#F5A623] flex items-center justify-center shrink-0 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
            <Calendar className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="text-left font-sans">
            <span className="text-xs font-extrabold text-[#1A1A1A] block tracking-tight">Log Site Visit</span>
            <span className="text-[10px] text-[#8A8A85]">Schedule buyer tour</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/blogs')}
          className="bg-white border border-[#E8E4DA] hover:border-[#F5A623] rounded-2xl p-4 flex items-center gap-3 transition-all group cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.04)]"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 text-[#F5A623] flex items-center justify-center shrink-0 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
            <FileText className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="text-left font-sans">
            <span className="text-xs font-extrabold text-[#1A1A1A] block tracking-tight">New Blog Post</span>
            <span className="text-[10px] text-[#8A8A85]">Publish market insight</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/customers')}
          className="bg-white border border-[#E8E4DA] hover:border-[#F5A623] rounded-2xl p-4 flex items-center gap-3 transition-all group cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.04)]"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 text-[#F5A623] flex items-center justify-center shrink-0 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
            <Users className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="text-left font-sans">
            <span className="text-xs font-extrabold text-[#1A1A1A] block tracking-tight">View All Customers</span>
            <span className="text-[10px] text-[#8A8A85]">VIP buyer roster</span>
          </div>
        </button>
      </div>

      {/* ── 3. TREND AREA CHART + RECENT ACTIVITY FEED ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Trend Area Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-extrabold block">
                ANALYTICS TREND
              </span>
              <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">
                Enquiries & Sales Volume Trend
              </h3>
            </div>

            {/* Segmented Control Range Switcher (30d / 60d / 90d) */}
            <div className="w-48 shrink-0">
              <SegmentedControl
                options={['30d', '60d', '90d']}
                value={chartRange}
                onChange={setChartRange}
              />
            </div>
          </div>

          {/* Chart Render */}
          <div className="pt-2">
            {renderTrendAreaChart()}
          </div>

          {/* Chart Summary Stats */}
          <div className="grid grid-cols-3 gap-4 border-t border-[#E8E4DA] pt-4 font-sans text-xs">
            <div>
              <span className="text-[#8A8A85] text-[10px] uppercase font-bold block">Period Enquiries</span>
              <span className="text-[#1A1A1A] font-extrabold text-base">{currentChart.totalEnquiries}</span>
            </div>
            <div>
              <span className="text-[#8A8A85] text-[10px] uppercase font-bold block">Conversion Rate</span>
              <span className="text-emerald-600 font-extrabold text-base">{currentChart.conversion}</span>
            </div>
            <div>
              <span className="text-[#8A8A85] text-[10px] uppercase font-bold block">Top Location</span>
              <span className="text-[#1A1A1A] font-extrabold text-base">ECR, Chennai</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity Feed Panel */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4">
          <div className="border-b border-[#E8E4DA] pb-3">
            <span className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-extrabold block">
              REAL-TIME UPDATES
            </span>
            <h3 className="text-lg font-extrabold text-[#1A1A1A] tracking-tight">
              Recent Admin Activity
            </h3>
          </div>

          {/* Activity List */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-80 custom-scrollbar pr-1">
            {mockActivities.map(act => (
              <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F1EA]/60 border border-[#E8E4DA] text-xs">
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1A1A1A]">{act.title}</p>
                  <p className="text-[11px] text-[#8A8A85] mt-0.5 leading-relaxed">{act.desc}</p>
                  <span className="text-[9px] text-[#8A8A85] mt-1 block font-medium">{act.time}</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/admin/notifications"
            className="text-xs font-bold text-[#1A1A1A] hover:text-[#F5A623] flex items-center justify-center gap-1 border-t border-[#E8E4DA] pt-3 cursor-pointer"
          >
            <span>View All Activity Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── 4. UPCOMING SITE VISITS MINI-TABLE ─────────────────────── */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.04)] font-sans">
        <div className="p-5 border-b border-[#E8E4DA] flex items-center justify-between bg-[#F4F1EA]/40">
          <div>
            <h3 className="text-base font-extrabold text-[#1A1A1A] tracking-tight">Upcoming Site Visits</h3>
            <p className="text-xs text-[#8A8A85]">Confirmed buyer tours scheduled for today and tomorrow</p>
          </div>
          <Link
            to="/admin/site-visits"
            className="text-xs font-bold text-[#1A1A1A] hover:text-[#F5A623] flex items-center gap-1 underline"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F1EA] text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold border-b border-[#E8E4DA]">
                <th className="py-3 px-5">Customer Name</th>
                <th className="py-3 px-5">Target Estate</th>
                <th className="py-3 px-5">Scheduled Slot</th>
                <th className="py-3 px-5">Consultant</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DA] text-xs font-medium text-[#1A1A1A]">
              {mockUpcomingVisits.map((visit, idx) => (
                <tr key={visit.id || visit._id || `v-${idx}`} className="hover:bg-[#F4F1EA]/50 transition-colors">
                  <td className="py-3.5 px-5 font-bold">{visit.name}</td>
                  <td className="py-3.5 px-5 text-[#8A8A85]">{visit.property}</td>
                  <td className="py-3.5 px-5">{visit.time}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#1A1A1A] text-[#F5A623] text-[9px] font-bold flex items-center justify-center">
                        {visit.consultant.charAt(0)}
                      </div>
                      <span>{visit.consultant}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <StatusChip status={visit.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. TOP PERFORMING LISTINGS MINI-TABLE ─────────────────── */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.04)] font-sans">
        <div className="p-5 border-b border-[#E8E4DA] flex items-center justify-between bg-[#F4F1EA]/40">
          <div>
            <h3 className="text-base font-extrabold text-[#1A1A1A] tracking-tight">Top Performing Listings</h3>
            <p className="text-xs text-[#8A8A85]">Highest customer views, wishlist saves, and active enquiries</p>
          </div>
          <Link
            to="/admin/properties"
            className="text-xs font-bold text-[#1A1A1A] hover:text-[#F5A623] flex items-center gap-1 underline"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F1EA] text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold border-b border-[#E8E4DA]">
                <th className="py-3 px-5">Property Estate</th>
                <th className="py-3 px-5">Views</th>
                <th className="py-3 px-5">Wishlist Saves</th>
                <th className="py-3 px-5">Enquiries</th>
                <th className="py-3 px-5 text-right">Asking Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DA] text-xs font-medium text-[#1A1A1A]">
              {topListings.map((item, idx) => (
                <tr key={item.id || item._id || `top-${idx}`} className="hover:bg-[#F4F1EA]/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-10 h-10 rounded-xl object-cover border border-[#E8E4DA]" />
                      <div>
                        <span className="font-bold text-[#1A1A1A] block">{item.title}</span>
                        <span className="text-[10px] text-[#8A8A85]">{item.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-bold">
                    <div className="flex items-center gap-1 text-[#1A1A1A]">
                      <Eye className="w-3.5 h-3.5 text-[#8A8A85]" />
                      <span>{item.views}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1 text-[#1A1A1A]">
                      <Heart className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>{item.saves}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-bold text-amber-600">{item.enquiries}</td>
                  <td className="py-3.5 px-5 text-right font-extrabold text-[#1A1A1A]">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
