import React, { useState } from 'react';
import { sessionApi } from '../services/sessionApi';
import { useSession } from '../context/SessionContext';
import {
  Brain,
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  FileQuestion,
  BookOpen,
  CheckCircle2,
  Copy,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citationSources?: string[];
  suggestedPrompt?: string;
}

export const AIAssistant: React.FC = () => {
  const { currentNotes, currentSession, setActiveNav, currentUser } = useSession();
  const topicTitle = currentSession?.title || currentNotes?.topic_title || 'Your Uploaded Documents';
  const sources = currentSession?.sources || [];

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello ${currentUser?.username || 'Student'}! I am your SynthNotes AI Study Assistant. I have indexed your ${sources.length || 3} source documents on "${topicTitle}". Ask me any conceptual question, request exam practice problems, or ask for cross-source comparisons!`,
      timestamp: 'Just now',
      citationSources: sources.map((s) => s.source_id),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Explain the core differences between the key concepts in these sources',
    'What did Textbook (S1) emphasize that Lecture Slides (S3) omitted?',
    'Give me a mnemonic to remember the most important definitions',
    'Generate 3 high-yield review points for my upcoming exam',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      if (!currentSession?.session_id) {
        throw new Error("No active session");
      }
      
      const response = await sessionApi.generateChatResponse(
        currentSession.session_id,
        query,
        messages.map(m => ({ sender: m.sender, text: m.text }))
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `ast_${Date.now()}`,
          sender: 'assistant',
          text: response.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citationSources: response.citationSources || [],
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ast_${Date.now()}`,
          sender: 'assistant',
          text: `Sorry, I encountered an error: ${error.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#0F172A]">AI Study Assistant</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] font-bold">
                Online • Source Grounded
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Trained strictly on your active topic: <strong className="text-[#334155]">{topicTitle}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveNav('flashcards')}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] rounded-lg hover:bg-[#E0E7FF] transition-colors cursor-pointer"
          >
            Study Flashcards
          </button>
          <button
            onClick={() => setActiveNav('notes')}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#334155] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            View Notes
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col h-[580px] overflow-hidden">
        {/* Messages List Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser ? 'bg-[#4338CA] text-white' : 'bg-[#EEF2FF] text-[#4F46E5]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] sm:max-w-[70%] p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#4338CA] text-white rounded-tr-none'
                      : 'bg-[#F8FAFC] text-[#1E293B] border border-[#E2E8F0] rounded-tl-none space-y-2'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {!isUser && msg.citationSources && (
                    <div className="pt-2 mt-2 border-t border-[#E2E8F0]/70 flex items-center gap-1.5 text-[11px] text-[#64748B]">
                      <span>Source Verified:</span>
                      {msg.citationSources.map((s) => (
                        <span
                          key={s}
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#CBD5E1] text-[#4F46E5] font-bold"
                        >
                          [{s}]
                        </span>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[10px] text-right mt-1 ${
                      isUser ? 'text-[#C7D2FE]' : 'text-[#94A3B8]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] w-36 text-xs text-[#64748B] animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>Analyzing sources...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Lightbulb className="w-3.5 h-3.5 text-[#EAB308] shrink-0" />
          <span className="text-[11px] text-[#64748B] font-semibold shrink-0">Quick Ask:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-[#CBD5E1] text-[#334155] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Bottom Input Field */}
        <div className="p-4 bg-white border-t border-[#E2E8F0]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about your uploaded sources or notes..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-[13px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#4338CA] text-white hover:bg-[#3730A3] disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
