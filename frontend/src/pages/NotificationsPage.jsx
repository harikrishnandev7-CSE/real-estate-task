import React from 'react';
import { Bell, Check, Sparkles } from 'lucide-react';
import PageHero from '../components/PageHero';

const NotificationsPage = () => {
  const notifications = [
    { title: "Price Drop Alert", desc: "The Ritz-Carlton Penthouse #1402 has updated listing parameters.", time: "2 Hours ago" },
    { title: "New Off-Market Listing", desc: "A 1.2 Acre sea-facing plot in ECR Chennai was added to Signature Collection.", time: "1 Day ago" }
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#16161a] font-sans pb-20">
      <PageHero
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Notifications' }
        ]}
        eyebrow="VIP INTELLIGENCE ALERTS"
        heading="Notification Center"
        description="Real-time alerts on off-market opportunities, price updates, and site visit confirmations."
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 font-sans">
        <div className="space-y-4">
          {notifications.map((n, idx) => (
            <div key={idx} className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-6 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[rgba(207,182,168,0.15)] text-[#CFB6A8] flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-[#363C46]" style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}>{n.title}</h4>
                  <span className="text-[10px] text-[#5D6472] font-bold">{n.time}</span>
                </div>
                <p className="text-xs text-[#5D6472]">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
