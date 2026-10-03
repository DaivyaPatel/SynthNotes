import React, { useState, useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import { User, Check, X, Lock } from 'lucide-react';
import { Button } from './Button';
import { authApi } from '../services/authApi';

export const AccountModal: React.FC = () => {
  const { isAccountModalOpen, setIsAccountModalOpen, loginUser, currentUser } = useSession();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // If there's no current user, the modal CANNOT be closed until they log in
  const canClose = currentUser !== null;

  // Clear fields every time the modal opens
  useEffect(() => {
    if (isAccountModalOpen) {
      setUsername('');
      setPassword('');
      setError('');
      setSuccess('');
    }
  }, [isAccountModalOpen]);

  if (!isAccountModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await authApi.login(username, password);
        loginUser(data.user_id, data.username);
      } else {
        await authApi.signup(username, password);
        setSuccess('Account created successfully! Please log in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in select-none ${!canClose ? 'bg-[#F1F5F9]' : 'bg-black/40 backdrop-blur-xs'}`}>
      <div className="bg-white rounded-3xl max-w-sm w-full border border-[#E2E8F0] shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <User className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">{isLogin ? 'Log In' : 'Sign Up'}</h3>
              <p className="text-[11px] text-[#64748B]">Access your SynthNotes account</p>
            </div>
          </div>
          {canClose && (
            <button
              onClick={() => setIsAccountModalOpen(false)}
              className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-xs bg-red-50 text-red-600 border border-red-200 p-2.5 rounded-xl font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="text-xs bg-green-50 text-green-700 border border-green-200 p-2.5 rounded-xl font-medium">
                {success}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                />
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] py-2.5 text-xs font-bold"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setUsername('');
                setPassword('');
              }}
              className="text-xs font-medium text-[#64748B] hover:text-[#4F46E5] transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
