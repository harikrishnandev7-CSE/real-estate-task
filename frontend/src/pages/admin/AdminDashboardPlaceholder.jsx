import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Users, 
  Calendar, 
  TrendingUp, 
  PlusCircle, 
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Layers
} from 'lucide-react';
import KPICard from '../../components/admin/primitives/KPICard';
import DataTable from '../../components/admin/primitives/DataTable';
import StatusChip from '../../components/admin/primitives/StatusChip';
import { useApp } from '../../context/AppContext';

const AdminDashboardPlaceholder = () => {
  const navigate = useNavigate();
  const { properties = [], siteVisits = [] } = useApp();

  // Columns definition for Dashboard Recent Visits table
  const visitColumns = [
    { key: 'propertyName', label: 'Property Estate', sortable: true },
    { key: 'consultantName', label: 'Assigned Advisor', sortable: true },
    { key: 'date', label: 'Scheduled Date', sortable: true },
    { key: 'time', label: 'Time Slot' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => <StatusChip status={val} />
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E8E4DA] rounded-2xl p-6 md:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5A623] font-extrabold block">
            IMPERIA ESTATES CONTROL PANEL
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            Executive Overview
          </h2>
          <p className="text-xs md:text-sm text-[#8A8A85] font-medium max-w-xl leading-relaxed">
            Welcome to the IMPERIA luxury real estate administration canvas. System scaffolding, navigation shell, and reusable primitives loaded.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/primitives')}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-[#F5A623]" />
            <span>Test Primitives Demo</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid (4 KPICards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Active Luxury Estates"
          value={properties.length || 12}
          icon={Building}
          delta={{ value: '+14.2%', positive: true }}
          sparkline={[8, 9, 10, 11, 10, 12, 12]}
        />
        <KPICard
          title="Site Tour Bookings"
          value={siteVisits.length || 24}
          icon={Calendar}
          delta={{ value: '+18.5%', positive: true }}
          sparkline={[12, 15, 14, 18, 20, 22, 24]}
        />
        <KPICard
          title="VIP Customer Roster"
          value="1,420"
          icon={Users}
          delta={{ value: '+8.4%', positive: true }}
          sparkline={[1100, 1200, 1280, 1340, 1420]}
        />
        <KPICard
          title="Transacted Capital"
          value="₹1.42 Cr+"
          icon={TrendingUp}
          delta={{ value: '+22.1%', positive: true }}
          sparkline={[80, 95, 110, 130, 142]}
        />
      </div>

      {/* Recent Site Visits DataTable */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#1A1A1A] tracking-tight">Recent Site Tour Bookings</h3>
            <p className="text-xs text-[#8A8A85]">Live updates from customer concierge visits</p>
          </div>
        </div>

        <DataTable
          columns={visitColumns}
          data={siteVisits}
          pageSize={5}
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </div>

    </div>
  );
};

export default AdminDashboardPlaceholder;
