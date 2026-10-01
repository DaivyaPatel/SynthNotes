import React from 'react';
import { AlignLeft, ListOrdered, BookOpen } from 'lucide-react';

interface NotesTabsProps {
  activeTab: 'detailed' | 'bullet';
  onTabChange: (tab: 'detailed' | 'bullet') => void;
}

export const NotesTabs: React.FC<NotesTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="inline-flex items-center p-1 bg-[#F1F3F0] rounded-xl border border-[#E4E7E2]">
      <button
        onClick={() => onTabChange('detailed')}
        className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
          activeTab === 'detailed'
            ? 'bg-white text-[#2E2E2E] shadow-xs'
            : 'text-[#5A5A5A] hover:text-[#2E2E2E]'
        }`}
      >
        <AlignLeft className="w-4 h-4 text-[#5B7C73]" />
        <span>Detailed Explanation</span>
      </button>

      <button
        onClick={() => onTabChange('bullet')}
        className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
          activeTab === 'bullet'
            ? 'bg-white text-[#2E2E2E] shadow-xs'
            : 'text-[#5A5A5A] hover:text-[#2E2E2E]'
        }`}
      >
        <ListOrdered className="w-4 h-4 text-[#5B7C73]" />
        <span>Bullet Revision Notes</span>
      </button>
    </div>
  );
};
