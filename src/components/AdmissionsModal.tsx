import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { X, CheckCircle2, Award, Calendar, FileText, ChevronRight } from 'lucide-react';

interface AdmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdmissionsModal: React.FC<AdmissionsModalProps> = ({ isOpen, onClose }) => {
  const { classes, schoolInfo } = useSchool();
  const [candidateName, setCandidateName] = useState('');
  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || 'Creche');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [appNumber, setAppNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appNum = `STB-ADM-${Date.now().toString().slice(-5)}`;
    setAppNumber(appNum);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-stone-900 to-indigo-950 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
              {schoolInfo.activeSession || '2026/2027'} Admissions
            </span>
            <h3 className="font-extrabold text-base text-white mt-1">Stanbax Schools Online Application</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-stone-900">Application Lodged Successfully!</h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Thank you for applying to Stanbax Schools Ibadan. Your application reference number is:
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-mono font-black text-lg">
                {appNumber}
              </div>
              <p className="text-xs text-stone-500">
                Our Admissions Office will contact you on <strong>{parentPhone}</strong> regarding the entrance assessment date and campus inspection.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-stone-900 text-white font-bold text-xs"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Scholar Full Name</label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. David Oluwaseun Adeleke"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Applying For Grade / Level</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.name}>{c.name} ({c.category})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Dr. & Mrs. Adeleke"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="parent@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Submit Entrance Application</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
