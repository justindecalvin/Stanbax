import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AdminLandingPageTab } from './admin/AdminLandingPageTab';
import { SchoolLogo } from '../SchoolLogo';
import { ArrowLeft, LogOut, ShieldCheck, Sliders, Globe } from 'lucide-react';

interface AdminPortalProps {
  onBackToWebsite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToWebsite }) => {
  const { logoutAll, schoolInfo } = useSchool();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800 shadow-md">
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
                <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                  Admin CMS & Website Studio
                </h1>
                <p className="text-[11px] text-amber-300 font-medium">
                  {schoolInfo.name || 'Stanbax Schools Ibadan'} • Chief Administrator
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CMS Safeguarding Active</span>
            </span>

            <button
              type="button"
              onClick={() => {
                logoutAll();
                onBackToWebsite();
              }}
              className="px-3.5 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Sign out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Tab */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <AdminLandingPageTab />
      </main>
    </div>
  );
};
