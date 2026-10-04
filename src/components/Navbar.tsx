import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { SchoolLogo } from './SchoolLogo';
import { 
  Menu, 
  X, 
  GraduationCap, 
  Lock, 
  Phone, 
  ChevronRight, 
  Sparkles, 
  Compass, 
  Sliders,
  Calendar,
  Award
} from 'lucide-react';
import { PageSection } from '../types';

interface NavbarProps {
  onNavigate: (section: PageSection) => void;
  activeSection: string;
  onOpenAdmissions: () => void;
  onOpenTuitionCalc?: () => void;
  onOpenStatusTracker?: () => void;
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activeSection,
  onOpenAdmissions,
  onOpenTuitionCalc
}) => {
  const { 
    schoolInfo, 
    isAdminAuthenticated, 
    isStudentAuthenticated, 
    isTutorAuthenticated, 
    isParentAuthenticated,
    student,
    tutor
  } = useSchool();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; section: PageSection }[] = [
    { label: 'Home', section: 'home' },
    { label: 'About & Vision', section: 'about' },
    { label: 'Academic Programs', section: 'programs' },
    { label: 'Student Life', section: 'student-life' },
    { label: 'Campus Gallery', section: 'gallery' },
    { label: 'Faculty & Team', section: 'faculty' },
    { label: 'Calendar & Bulletins', section: 'calendar' },
    { label: 'Contact', section: 'contact' }
  ];

  const handleLinkClick = (sec: PageSection) => {
    onNavigate(sec);
    setMobileMenuOpen(false);
  };

  const currentTheme = schoolInfo.websiteTheme || 'royal-navy';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 transition-colors shadow-2xs">
      {/* Top Banner Alert Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-stone-900 to-indigo-950 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between border-b border-stone-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] uppercase tracking-wider">
              {schoolInfo.activeSession || '2026/2027 Session'}
            </span>
            <span className="hidden sm:inline text-stone-300">
              {schoolInfo.activeTerm || '2nd Term Lent'} • Admissions Now Ongoing Across Creche, Primary & Secondary
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] shrink-0">
            <a 
              href={`tel:${schoolInfo.admissionsPhone || schoolInfo.phone || '+2348031234567'}`}
              className="flex items-center gap-1.5 text-stone-300 hover:text-amber-300 transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">{schoolInfo.admissionsPhone || schoolInfo.phone || '+234 803 123 4567'}</span>
            </a>

            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-stone-300">Theme:</span>
              <span className="text-amber-300 font-bold uppercase text-[10px]">
                {currentTheme.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          onClick={() => handleLinkClick('home')}
          className="cursor-pointer shrink-0"
        >
          <SchoolLogo size="md" variant="dark" showText={true} />
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-stone-700">
          {navLinks.map((item) => (
            <button
              key={item.section}
              type="button"
              onClick={() => handleLinkClick(item.section)}
              className={`transition-colors py-1 cursor-pointer hover:text-blue-900 ${
                activeSection === item.section 
                  ? 'text-blue-900 font-extrabold border-b-2 border-blue-900 -mb-0.5' 
                  : 'text-stone-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {isAdminAuthenticated ? (
            <button
              type="button"
              onClick={() => onNavigate('admin-portal')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Admin CMS Portal</span>
            </button>
          ) : isStudentAuthenticated && student ? (
            <button
              type="button"
              onClick={() => onNavigate('student-portal')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>Scholar Portal</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('portal-login')}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-stone-600" />
              <span>Portal Sign-In</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAdmissions}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md hover:shadow-red-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Apply Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.section}
                type="button"
                onClick={() => handleLinkClick(item.section)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeSection === item.section ? 'bg-blue-50 text-blue-900 font-black' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onNavigate('portal-login');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Portal Access (Admin, Scholar, Tutor, Parent)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenAdmissions();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <span>Admissions Online Application</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
