import React from 'react';
import { useSession } from '../context/SessionContext';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export const NotFound: React.FC = () => {
  const { setActiveNav } = useSession();

  return (
    <div className="py-16 text-center space-y-4 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-[#EDF1EF] text-[#5B7C73] flex items-center justify-center mx-auto">
        <FileQuestion className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-[#2E2E2E]">Page Not Found</h2>
      <p className="text-xs text-[#5A5A5A]">
        The study topic or view you requested is not currently available.
      </p>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setActiveNav('home')}
        icon={<ArrowLeft className="w-3.5 h-3.5" />}
      >
        Return to Home
      </Button>
    </div>
  );
};
