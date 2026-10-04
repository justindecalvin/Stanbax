import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { X, CheckCircle2, UserPlus, GraduationCap, ShieldCheck } from 'lucide-react';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess?: (registered: { regNumber: string; name: string }) => void;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegistrationSuccess
}) => {
  const { classes, schoolInfo } = useSchool();
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState(classes[0]?.name || 'SSS 2');
  const [parentPhone, setParentPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedReg, setGeneratedReg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const regNum = `STB/${new Date().getFullYear()}/${randomNum}`;
    setGeneratedReg(regNum);
    setIsSuccess(true);

    if (onRegistrationSuccess) {
      onRegistrationSuccess({ regNumber: regNum, name: fullName });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">New Scholar Enrollment & Portal Setup</h3>
              <p className="text-xs text-stone-300">Stanbax Schools Ibadan Admission Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-stone-900">Scholar Enrolled Successfully!</h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Welcome to Stanbax Schools Ibadan. Your official portal matriculation identifier has been assigned:
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-mono font-black text-lg">
                {generatedReg}
              </div>
              <p className="text-[11px] text-stone-400">
                Please save this registration number. It has been pre-filled into your portal sign-in screen.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition"
              >
                Proceed to Scholar Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Scholar Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Oluwaseun Adeleke"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Assigned Grade / Class</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.name}>{c.name} ({c.category})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Parent / Guardian WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Portal Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure 6+ character password"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition"
                >
                  Complete Enrollment & Assign ID
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
