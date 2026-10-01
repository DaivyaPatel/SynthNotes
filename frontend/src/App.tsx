/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { AccountModal } from './components/AccountModal';
import { Home } from './pages/Home';
import { UploadSources } from './pages/UploadSources';
import { Validation } from './pages/Validation';
import { Processing } from './pages/Processing';
import { NotesDashboard } from './pages/NotesDashboard';
import { Quiz } from './pages/Quiz';
import { Flashcards } from './pages/Flashcards';
import { AIAssistant } from './pages/AIAssistant';
import { SessionHistory } from './pages/SessionHistory';
import { CompareSources } from './pages/CompareSources';
import { SettingsPage } from './pages/SettingsPage';
import { NotFound } from './pages/NotFound';

function MainAppContent() {
  const { activeNav, isProcessing } = useSession();

  const renderActiveView = () => {
    if (isProcessing) {
      return <Processing />;
    }

    switch (activeNav) {
      case 'home':
        return <Home />;
      case 'upload':
        return <UploadSources />;
      case 'validation':
        return <Validation />;
      case 'processing':
        return <Processing />;
      case 'notes':
        return <NotesDashboard />;
      case 'quiz':
        return <Quiz />;
      case 'flashcards':
        return <Flashcards />;
      case 'ai_assistant':
        return <AIAssistant />;
      case 'history':
        return <SessionHistory />;
      case 'compare':
        return <CompareSources />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      {/* Left Sidebar matching the reference screenshot */}
      <Sidebar />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          {renderActiveView()}
        </main>

        <Footer />
      </div>

      {/* Global Account Management Modal */}
      <AccountModal />
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <MainAppContent />
    </SessionProvider>
  );
}
