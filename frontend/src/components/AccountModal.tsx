import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import {
  User,
  Plus,
  Check,
  LogOut,
  Mail,
  GraduationCap,
  Sparkles,
  X,
  Shield,
  BookOpen,
} from 'lucide-react';
import { Button } from './Button';

export const AccountModal: React.FC = () => {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    accounts,
    currentAccount,
    switchAccount,
    addNewAccount,
  } = useSession();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Student Mode');

  if (!isAccountModalOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    addNewAccount({
      id: `acc_${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      avatarInitial: newName.trim().charAt(0).toUpperCase(),
    });

    setIsAddingNew(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#E2E8F0] shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <User className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Account Management</h3>
              <p className="text-[11px] text-[#64748B]">Switch accounts or register an exam profile</p>
            </div>
          </div>
          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!isAddingNew ? (
            <>
              {/* Account list */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
                  Switch Active Account
                </span>

                {accounts.map((acc) => {
                  const isCurrent = acc.id === currentAccount.id;

                  return (
                    <div
                      key={acc.id}
                      onClick={() => {
                        switchAccount(acc.id);
                        setIsAccountModalOpen(false);
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-[#4F46E5] bg-[#EEF2FF]/60 ring-1 ring-[#4F46E5]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCurrent
                              ? 'bg-[#4F46E5] text-white shadow-xs'
                              : 'bg-[#F1F5F9] text-[#475569]'
                          }`}
                        >
                          {acc.avatarInitial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0F172A] truncate">{acc.name}</p>
                          <p className="text-[11px] text-[#64748B] truncate">{acc.email}</p>
                          <span className="text-[10px] text-[#4F46E5] font-medium block mt-0.5">
                            {acc.role}
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <div className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Account Trigger Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-[#CBD5E1] text-[#4F46E5] hover:border-[#4F46E5] hover:bg-[#EEF2FF]/30 transition-all font-semibold text-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Account / Student Profile</span>
                </button>
              </div>
            </>
          ) : (
            /* Add Account Form */
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                <h4 className="text-xs font-bold text-[#0F172A]">Add New Account</h4>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Full Name / Student Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Email Address:
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex.johnson@university.edu"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Target Profile Type:
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                >
                  <option>Student Mode (GATE / GRE Prep)</option>
                  <option>Researcher / Postgrad Mode</option>
                  <option>Educator / Professor Mode</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingNew(false)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-[#4338CA] hover:bg-[#3730A3]"
                >
                  Create &amp; Switch Account
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
