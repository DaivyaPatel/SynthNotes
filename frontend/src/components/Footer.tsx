import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-6 sm:px-8 border-t border-[#F1F5F9] mt-auto text-xs text-[#64748B]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          &copy; 2026 SynthNotes. Transforming Multiple Study Resources into One Exam-Ready Note.
        </div>
        <div className="flex items-center gap-6">
          <button className="hover:text-[#0F172A] transition-colors cursor-pointer">About</button>
          <button className="hover:text-[#0F172A] transition-colors cursor-pointer">Feedback</button>
          <button className="hover:text-[#0F172A] transition-colors cursor-pointer">Help</button>
        </div>
      </div>
    </footer>
  );
};
