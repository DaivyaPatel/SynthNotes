import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import {
  Brain,
  Home,
  Upload,
  FileText,
  BarChart2,
  Bookmark,
  Settings,
  ChevronDown,
  Layers,
  Sparkles,
  Bot,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeNav, setActiveNav, setIsAccountModalOpen, currentUser, logoutUser } = useSession();

  const navItems = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'upload', label: 'Upload & Generate', icon: Upload },
    { key: 'notes', label: 'My Notes', icon: FileText },
    { key: 'flashcards', label: 'Flashcards', icon: Layers },
    { key: 'ai_assistant', label: 'AI Study Assistant', icon: Bot },
    { key: 'compare', label: 'Compare Sources', icon: BarChart2 },
    { key: 'history', label: 'Saved Topics', icon: Bookmark },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-[245px] bg-white border-r border-[#E8ECF2] shrink-0 min-h-screen flex flex-col justify-between hidden md:flex p-5 select-none font-sans">
      {/* Brand logo top left */}
      <div className="space-y-6">
        <button
          onClick={() => setActiveNav('home')}
          className="flex items-start gap-2.5 text-left w-full group cursor-pointer focus:outline-none"
        >
          {/* Logo icon matching screenshot: Indigo/purple brain vector */}
          <div className="w-8 h-8 rounded-lg text-[#4F46E5] flex items-center justify-center shrink-0 mt-0.5">
            <svg
              className="w-8 h-8"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 6C8.23858 6 6 8.23858 6 11C6 11.854 6.21447 12.658 6.59253 13.3615C5.63273 14.3649 5 15.7486 5 17.2727C5 19.3496 6.17724 21.1444 7.8735 22.0673C7.95438 23.7226 9.32422 25.0455 11 25.0455C11.5202 25.0455 12.0089 24.9147 12.4382 24.685C13.2355 25.4952 14.3547 26 15.5909 26V6C13.8837 6 12.383 6.94217 11.5909 8.32766C11.4019 8.11707 11.2079 7.92542 11 7.75705V6Z"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 6C23.7614 6 26 8.23858 26 11C26 11.854 25.7855 12.658 25.4075 13.3615C26.3673 14.3649 27 15.7486 27 17.2727C27 19.3496 25.8228 21.1444 24.1265 22.0673C24.0456 23.7226 22.6758 25.0455 21 25.0455C20.4798 25.0455 19.9911 24.9147 19.5618 24.685C18.7645 25.4952 17.6453 26 16.4091 26V6C18.1163 6 19.617 6.94217 20.4091 8.32766C20.5981 8.11707 20.7921 7.92542 21 7.75705V6Z"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="11.5" cy="12.5" r="1.5" fill="#4F46E5" />
              <circle cx="20.5" cy="12.5" r="1.5" fill="#4F46E5" />
              <circle cx="11.5" cy="18.5" r="1.5" fill="#4F46E5" />
              <circle cx="20.5" cy="18.5" r="1.5" fill="#4F46E5" />
              <path d="M11.5 14V17" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M20.5 14V17" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="text-[17px] font-bold text-[#1E293B] tracking-tight leading-snug">
              SynthNotes
            </div>
            <p className="text-[10px] text-[#64748B] tracking-tight whitespace-nowrap leading-none mt-0.5">
              Multiple Sources. One Clear Note.
            </p>
          </div>
        </button>

        {/* Sidebar Nav Items */}
        <nav className="space-y-1.5 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                    : 'text-[#475569] hover:text-[#1E293B] hover:bg-[#F8FAFC]'
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 ${
                    isActive ? 'text-[#4F46E5]' : 'text-[#64748B]'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section with Quote & Interactive Account Bar */}
      <div className="pt-6 space-y-4">
        {/* Quote text from reference */}
        <div className="pl-1 pr-2">
          <p className="text-[12px] font-serif italic text-[#334155] leading-relaxed">
            &ldquo;Turn information overload into exam success.&rdquo;
          </p>
          <p className="text-[10px] text-[#94A3B8] mt-0.5">
            - SynthNotes
          </p>
        </div>

        {/* Interactive Account Bar */}
        <div className="pt-3 border-t border-[#F1F5F9] space-y-2">
          <button
            onClick={() => { if(window.confirm('Are you sure you want to log out?')) logoutUser(); }}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-[13px] font-semibold text-[#1E293B] block truncate">
                  {currentUser?.username}
                </span>
                <span className="text-[10px] text-[#64748B] block truncate">
                  User
                </span>
              </div>
            </div>
            <LogOut className="w-4 h-4 text-[#94A3B8] shrink-0 group-hover:text-[#EF4444] transition-colors" />
          </button>

          <div className="flex items-center gap-2 px-1.5 text-[11px] text-[#64748B]">
            <span className="w-4 h-4 text-[#4F46E5] flex items-center justify-center font-serif text-sm">
              🎓
            </span>
            <span className="font-medium text-[#475569]">
              Student Mode
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
