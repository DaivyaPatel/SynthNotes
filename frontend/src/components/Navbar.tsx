import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { Search, Bell, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { searchQuery, setSearchQuery, setIsAccountModalOpen, currentUser, logoutUser, setActiveNav } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-xs px-6 sm:px-8 py-3.5 flex items-center justify-between gap-4 border-b border-[#F1F5F9]/80 sticky top-0 z-30 font-sans">
      {/* Search Bar matching screenshot */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your topics, notes or files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] text-[13px] text-[#1E293B] placeholder-[#94A3B8] rounded-full border border-[#E2E8F0] focus:outline-none focus:border-[#4F46E5] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/15 transition-all"
          />
        </div>
      </div>

      {/* Right side items: Bell Notification + Avatar with working account modal trigger */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] absolute top-2 right-2" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-3 z-50 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                <span className="font-semibold text-[#1E293B]">Notifications</span>
                <span className="text-[10px] text-[#4F46E5] font-semibold">1 Unread</span>
              </div>
              <div className="mt-2 p-2 rounded-lg bg-[#F8FAFC] text-[11px] text-[#475569]">
                <p className="font-semibold text-[#1E293B]">Gradient Descent Completed</p>
                <p className="text-[#64748B] mt-0.5">Synthesized 4 sources into an exam-ready note.</p>
              </div>
            </div>
          )}
        </div>

        {/* Working Account dropdown button */}
        <button
          type="button"
          onClick={() => setActiveNav('settings')}
          className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
          title="Account Settings"
        >
          <div className="w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            {currentUser?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-semibold text-[#64748B] group-hover:text-[#4F46E5] transition-colors pr-2">
            Settings
          </span>
        </button>
      </div>
    </header>
  );
};
