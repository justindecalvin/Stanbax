import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { StudentCalvinAiTab } from './student/StudentCalvinAiTab';
import { SchoolLogo } from '../SchoolLogo';
import { ArrowLeft, LogOut, GraduationCap, Sparkles, User } from 'lucide-react';

interface StudentPortalProps {
  onBackToWebsite: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ onBackToWebsite }) => {
  const { student, logoutAll, schoolInfo } = useSchool();

  const activeStudent = student || {
    id: 'std-demo-1',
    regNumber: 'STB/2026/089',
    name: 'Toluwanimi Adeleke',
    grade: 'SSS 2',
    dateOfBirth: '2010-04-15',
    house: 'Blue Falcons',
    parentContact: '+234 803 123 4567',
    calvinAiAccess: { active: true, tier: 'premium' as const }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Student Portal Navigation Bar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-950 via-indigo-950 to-stone-900 text-white border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToWebsite}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to School Website</span>
            </button>

            <div className="h-6 w-px bg-stone-700 hidden sm:block" />

            <div className="flex items-center gap-3">
              <SchoolLogo size="sm" variant="light" showText={false} />
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight flex items-center gap-2">
                  <span>Scholar Academic Portal</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-amber-400 text-stone-950 uppercase tracking-wider">
                    {activeStudent.grade}
                  </span>
                </h1>
                <p className="text-[11px] text-amber-300 font-medium">
                  {activeStudent.name} • Matric No: {activeStudent.regNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                logoutAll();
                onBackToWebsite();
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Student Portal Content - Calvin AI Tutor Tab */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <StudentCalvinAiTab student={activeStudent} />
      </main>
    </div>
  );
};
