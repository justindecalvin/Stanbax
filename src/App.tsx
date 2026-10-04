import React, { useState, useEffect } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { KeyPillars } from './components/KeyPillars';
import { AboutSection } from './components/AboutSection';
import { AcademicPrograms } from './components/AcademicPrograms';
import { StudentLifeSection } from './components/StudentLifeSection';
import { CampusGallery } from './components/CampusGallery';
import { FacultyTeam } from './components/FacultyTeam';
import { AcademicCalendarSection } from './components/AcademicCalendarSection';
import { NoticeBoard } from './components/NoticeBoard';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdmissionsModal } from './components/AdmissionsModal';
import { FloatingChatWidget } from './components/chat/FloatingChatWidget';
import { PortalLoginPage } from './components/PortalLoginPage';
import { AdminPortal } from './components/portals/AdminPortal';
import { StudentPortal } from './components/portals/StudentPortal';
import { PageSection } from './types';

const MainAppContent: React.FC = () => {
  const { 
    activeSection, 
    setActiveSection, 
    schoolInfo,
    isAdminAuthenticated,
    isStudentAuthenticated
  } = useSchool();

  const [isAdmissionsOpen, setIsAdmissionsOpen] = useState(false);

  // Synchronize dynamic active website theme to HTML root element
  useEffect(() => {
    const theme = schoolInfo.websiteTheme || 'royal-navy';
    document.documentElement.setAttribute('data-theme', theme);
  }, [schoolInfo.websiteTheme]);

  const handleNavigate = (section: PageSection) => {
    setActiveSection(section);
    if (section.includes('portal') || section === 'portal-login') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetElement = document.getElementById(section);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 1. Admin CMS Portal View
  if (activeSection === 'admin-portal') {
    return (
      <div className="min-h-screen text-stone-900 font-sans">
        <AdminPortal onBackToWebsite={() => handleNavigate('home')} />
        <FloatingChatWidget />
      </div>
    );
  }

  // 2. Scholar Portal View (with Calvin AI Tutor & Scheme Grounding)
  if (activeSection === 'student-portal') {
    return (
      <div className="min-h-screen text-stone-900 font-sans">
        <StudentPortal onBackToWebsite={() => handleNavigate('home')} />
        <FloatingChatWidget />
      </div>
    );
  }

  // 3. Portal Unified Login View
  if (activeSection === 'portal-login') {
    return (
      <div className="min-h-screen text-stone-900 font-sans">
        <PortalLoginPage
          onBackToWebsite={() => handleNavigate('home')}
          onLoginSuccess={(role) => {
            if (role === 'admin') handleNavigate('admin-portal');
            else if (role === 'student') handleNavigate('student-portal');
            else handleNavigate('home');
          }}
        />
        <FloatingChatWidget />
      </div>
    );
  }

  // 4. Main Public Landing Page Flow (Themed dynamically)
  return (
    <div className="min-h-screen text-stone-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic Header */}
      <Navbar
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onOpenAdmissions={() => setIsAdmissionsOpen(true)}
      />

      {/* Main Website Sections */}
      <main className="flex-1">
        <div id="home">
          <HeroBanner
            onNavigate={handleNavigate}
            onOpenAdmissions={() => setIsAdmissionsOpen(true)}
          />
        </div>

        <KeyPillars />

        <div id="about">
          <AboutSection onOpenAdmissions={() => setIsAdmissionsOpen(true)} />
        </div>

        <div id="programs">
          <AcademicPrograms onOpenAdmissions={() => setIsAdmissionsOpen(true)} />
        </div>

        <div id="student-life">
          <StudentLifeSection onOpenAdmissions={() => setIsAdmissionsOpen(true)} />
        </div>

        <div id="gallery">
          <CampusGallery onOpenAdmissions={() => setIsAdmissionsOpen(true)} />
        </div>

        <div id="faculty">
          <FacultyTeam />
        </div>

        <div id="calendar">
          <AcademicCalendarSection />
        </div>

        <div id="notices">
          <NoticeBoard />
        </div>

        <div id="testimonials">
          <Testimonials />
        </div>

        <div id="contact">
          <ContactSection />
        </div>
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmissions={() => setIsAdmissionsOpen(true)}
        onOpenTuitionCalc={() => setIsAdmissionsOpen(true)}
        onOpenStatusTracker={() => setIsAdmissionsOpen(true)}
      />

      {/* Floating Admissions WhatsApp Contact */}
      <WhatsAppButton />

      {/* Universal Floating Chat Hub & 24/7 Calvin AI */}
      <FloatingChatWidget />

      {/* Admissions Entrance Application Modal */}
      <AdmissionsModal
        isOpen={isAdmissionsOpen}
        onClose={() => setIsAdmissionsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainAppContent />
    </SchoolProvider>
  );
}
