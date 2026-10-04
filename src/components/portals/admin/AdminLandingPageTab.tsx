import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { compressImageFile } from '../../../utils/imageUploadHelper';
import { SchoolLogo } from '../../SchoolLogo';
import { CampusGallery } from '../../CampusGallery';
import { 
  Save, 
  RotateCcw, 
  Layout, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  Trash2, 
  Plus, 
  Edit3, 
  Eye, 
  School as SchoolIcon, 
  BookOpen, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Trophy, 
  MessageSquare, 
  Award, 
  Layers, 
  Sliders, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Bell,
  HelpCircle,
  Globe,
  Clock,
  Star,
  GraduationCap
} from '../../RealIcons';
import { 
  HeroSlide, 
  AcademicProgram, 
  KeyPillarItem, 
  Club, 
  Testimonial, 
  HouseStanding,
  FacultyMember,
  Notice,
  AcademicCalendarEvent,
  FAQItem,
  FeaturedCourse,
  WebsiteTheme,
  ThemeConfig
} from '../../../types';
import { 
  DEFAULT_IMAGES,
  DEFAULT_FEATURED_COURSES,
  DEFAULT_TESTIMONIALS_HEADER,
  WEBSITE_THEMES
} from '../../../data/schoolData';

type CmsSubTab = 
  | 'theme'
  | 'logo' 
  | 'hero' 
  | 'about' 
  | 'programs' 
  | 'pillars' 
  | 'student_life' 
  | 'faculty' 
  | 'calendar' 
  | 'notices' 
  | 'gallery' 
  | 'testimonials' 
  | 'faq' 
  | 'contact' 
  | 'footer';

export const AdminLandingPageTab: React.FC = () => {
  const { 
    schoolInfo, 
    updateSchoolInfo, 
    resetSchoolInfoToDefault,
    images, 
    updateImage, 
    resetImagesToDefault,
    heroSlides, 
    updateHeroSlide, 
    addHeroSlide, 
    deleteHeroSlide, 
    resetHeroSlidesToDefault,
    heroHighlights, 
    updateHeroHighlights, 
    resetHeroHighlightsToDefault,
    aboutContent, 
    updateAboutContent, 
    resetAboutContentToDefault,
    academicPrograms, 
    updateAcademicProgram, 
    addAcademicProgram, 
    deleteAcademicProgram, 
    resetAcademicProgramsToDefault,
    featuredCourses,
    updateFeaturedCourse,
    addFeaturedCourse,
    deleteFeaturedCourse,
    resetFeaturedCoursesToDefault,
    galleryPhotos,
    addGalleryPhoto,
    updateGalleryPhoto,
    deleteGalleryPhoto,
    resetGalleryPhotosToDefault,
    keyPillars, 
    keyPillarsHeader, 
    updateKeyPillar, 
    addKeyPillar, 
    deleteKeyPillar, 
    updateKeyPillarsHeader, 
    resetKeyPillarsToDefault,
    clubs, 
    updateClub, 
    addClub, 
    deleteClub, 
    resetClubsToDefault,
    students,
    assignClubLeaders,
    houseStandings, 
    updateHouseStanding, 
    addHouseStanding,
    deleteHouseStanding,
    resetHouseStandingsToDefault,
    facultyList,
    updateFacultyMember,
    addFacultyMember,
    deleteFacultyMember,
    resetFacultyToDefault,
    proprietressProfile,
    updateProprietressProfile,
    calendarEvents,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    resetCalendarEventsToDefault,
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    testimonials, 
    testimonialsHeader, 
    updateTestimonial, 
    addTestimonial, 
    deleteTestimonial, 
    updateTestimonialsHeader, 
    resetTestimonialsToDefault,
    faqItems,
    faqContent,
    addFaqItem,
    updateFaqItem,
    deleteFaqItem,
    updateFaqContent,
    resetFaqToDefault
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<CmsSubTab>('logo');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  // Form states initialized with context values
  const [logoForm, setLogoForm] = useState({
    logoUrl: schoolInfo.logoUrl || (images.crest && !images.crest.includes('photo-1546410531-bb4caa6b424d') ? images.crest : ''),
    name: schoolInfo.name || 'Stanbax Schools',
    shortName: schoolInfo.shortName || 'Stanbax Schools',
    motto: schoolInfo.motto || 'Excellence, Character & Global Leadership',
    establishedYear: aboutContent.establishedYear || '2008',
    city: schoolInfo.city || 'Ibadan',
    state: schoolInfo.state || 'Oyo State'
  });

  const [aboutForm, setAboutForm] = useState(aboutContent);
  const [pillarHeaderForm, setPillarHeaderForm] = useState(keyPillarsHeader);
  const [enrichmentHeaderForm, setEnrichmentHeaderForm] = useState({
    badge: schoolInfo.enrichmentHeader?.badge || 'Co-Curricular & Specializations',
    title: schoolInfo.enrichmentHeader?.title || 'Enrichment & Specialty Clubs',
    subtitle: schoolInfo.enrichmentHeader?.subtitle || 'Hands-on practical development outside the traditional classroom syllabus.'
  });
  const [studentLifeHighlights, setStudentLifeHighlights] = useState({
    badge: schoolInfo.studentLifeHeader?.badge || 'School Life & Holistic Development',
    title: schoolInfo.studentLifeHeader?.title || 'Vibrant Student Life at Stanbax Schools',
    subtitle: schoolInfo.studentLifeHeader?.subtitle || 'Beyond classroom instruction, our scholars thrive in inter-house sports competitions, academic & STEM clubs, cultural festivities, and holistic character development.',
    sportsBadge: schoolInfo.studentLifeHeader?.sportsBadge || 'Athletics & Fitness',
    sportsTitle: schoolInfo.studentLifeHeader?.sportsTitle || 'Inter-House Sports Tournament',
    sportsPhotoUrl: schoolInfo.studentLifeHeader?.sportsPhotoUrl || images.sports || '',
    culturalBadge: schoolInfo.studentLifeHeader?.culturalBadge || 'Heritage & Unity',
    culturalTitle: schoolInfo.studentLifeHeader?.culturalTitle || 'Annual Cultural Day & Arts',
    culturalPhotoUrl: schoolInfo.studentLifeHeader?.culturalPhotoUrl || images.cultural || '',
    artBadge: schoolInfo.studentLifeHeader?.artBadge || 'Discovery & Design',
    artTitle: schoolInfo.studentLifeHeader?.artTitle || 'Creative Arts & STEM Labs',
    artPhotoUrl: schoolInfo.studentLifeHeader?.artPhotoUrl || images.artClass || ''
  });
  const [facultyHeaderForm, setFacultyHeaderForm] = useState({
    badge: schoolInfo.facultyHeader?.badge || 'Academic Leadership',
    title: schoolInfo.facultyHeader?.title || 'Meet Our Faculty & Administration',
    subtitle: schoolInfo.facultyHeader?.subtitle || 'Dedicated educators, mentors, and administrators committed to cultivating intellect, discipline, and moral distinction at Stanbax Schools Ibadan.'
  });
  const [founderProfileForm, setFounderProfileForm] = useState({
    portraitUrl: proprietressProfile.portraitUrl || images.founders || '',
    name: proprietressProfile.name || 'Mrs. Adebisi Folashade Bello',
    honorifics: proprietressProfile.honorifics || 'Proprietress & Visionary',
    title: proprietressProfile.title || 'Founder & Executive Director',
    establishedYear: String(proprietressProfile.establishedYear || '2007'),
    tagline: proprietressProfile.tagline || 'Excellence is not an accident; it is the habit of dedicated mentors and eager minds.'
  });
  const [calendarHeaderForm, setCalendarHeaderForm] = useState({
    badge: schoolInfo.calendarHeader?.badge || 'Academic Planning',
    title: schoolInfo.calendarHeader?.title || `${schoolInfo.activeSession || '2026/2027 Academic Session'} Calendar`,
    subtitle: schoolInfo.calendarHeader?.subtitle || 'Key school resumption schedules, continuous assessment periods, parent-teacher conferences, and holiday breaks.'
  });
  const [noticesHeaderForm, setNoticesHeaderForm] = useState({
    badge: schoolInfo.noticesHeader?.badge || 'Official School Bulletins',
    title: schoolInfo.noticesHeader?.title || 'School Announcements & Notices'
  });
  const [testimonialHeaderForm, setTestimonialHeaderForm] = useState(testimonialsHeader);
  const [faqHeaderForm, setFaqHeaderForm] = useState({
    badge: faqContent?.badge || 'Frequently Asked Questions',
    title: faqContent?.title || 'Frequently Asked Questions',
    subtitle: faqContent?.subtitle || 'Get fast answers to common questions about admissions, academics, and daily school operations.'
  });
  const [contactForm, setContactForm] = useState({
    contactHeading: schoolInfo.contactHeading || 'Get in Touch with Stanbax Schools',
    contactSubtitle: schoolInfo.contactSubtitle || 'We welcome prospective parents, scholars, and community members. Contact our admissions desk or visit our main school premises in Ibadan.',
    address: schoolInfo.address || '',
    city: schoolInfo.city || '',
    state: schoolInfo.state || '',
    country: schoolInfo.country || 'Nigeria',
    phone: schoolInfo.phone || '',
    email: schoolInfo.email || '',
    admissionsEmail: schoolInfo.admissionsEmail || '',
    whatsapp: schoolInfo.whatsapp || '',
    admissionsPhone: schoolInfo.admissionsPhone || schoolInfo.phone || '',
    contactOfficeHours: schoolInfo.contactOfficeHours || 'Monday – Friday: 07:30 AM – 04:30 PM'
  });
  const [footerForm, setFooterForm] = useState({
    footerBio: schoolInfo.footerBio || '',
    footerAccreditation: schoolInfo.footerAccreditation || '',
    footerCopyright: schoolInfo.footerCopyright || '',
    facebook: schoolInfo.socialLinks?.facebook || '',
    instagram: schoolInfo.socialLinks?.instagram || '',
    twitter: schoolInfo.socialLinks?.twitter || '',
    linkedin: schoolInfo.socialLinks?.linkedin || '',
    youtube: schoolInfo.socialLinks?.youtube || ''
  });

  const [selectedTheme, setSelectedTheme] = useState<WebsiteTheme>(schoolInfo.websiteTheme || 'royal-navy');
  const [themeSaveSuccess, setThemeSaveSuccess] = useState(false);

  const handleApplyTheme = (themeId: WebsiteTheme) => {
    setSelectedTheme(themeId);
    updateSchoolInfo({ websiteTheme: themeId });
    document.documentElement.setAttribute('data-theme', themeId);
    setThemeSaveSuccess(true);
    setTimeout(() => setThemeSaveSuccess(false), 3500);
  };

  // Keep forms in sync when context changes
  useEffect(() => {
    setLogoForm(prev => ({
      ...prev,
      logoUrl: schoolInfo.logoUrl || (images.crest && !images.crest.includes('photo-1546410531-bb4caa6b424d') ? images.crest : ''),
      name: schoolInfo.name || prev.name,
      shortName: schoolInfo.shortName || prev.shortName,
      motto: schoolInfo.motto || prev.motto,
      city: schoolInfo.city || prev.city,
      state: schoolInfo.state || prev.state
    }));
    setContactForm({
      contactHeading: schoolInfo.contactHeading || 'Get in Touch with Stanbax Schools',
      contactSubtitle: schoolInfo.contactSubtitle || 'We welcome prospective parents, scholars, and community members. Contact our admissions desk or visit our main school premises in Ibadan.',
      address: schoolInfo.address || '',
      city: schoolInfo.city || '',
      state: schoolInfo.state || '',
      country: schoolInfo.country || 'Nigeria',
      phone: schoolInfo.phone || '',
      email: schoolInfo.email || '',
      admissionsEmail: schoolInfo.admissionsEmail || '',
      whatsapp: schoolInfo.whatsapp || '',
      admissionsPhone: schoolInfo.admissionsPhone || schoolInfo.phone || '',
      contactOfficeHours: schoolInfo.contactOfficeHours || 'Monday – Friday: 07:30 AM – 04:30 PM'
    });
    setFooterForm({
      footerBio: schoolInfo.footerBio || '',
      footerAccreditation: schoolInfo.footerAccreditation || '',
      footerCopyright: schoolInfo.footerCopyright || '',
      facebook: schoolInfo.socialLinks?.facebook || '',
      instagram: schoolInfo.socialLinks?.instagram || '',
      twitter: schoolInfo.socialLinks?.twitter || '',
      linkedin: schoolInfo.socialLinks?.linkedin || '',
      youtube: schoolInfo.socialLinks?.youtube || ''
    });
    setFounderProfileForm({
      portraitUrl: proprietressProfile.portraitUrl || images.founders || '',
      name: proprietressProfile.name || 'Mrs. Adebisi Folashade Bello',
      honorifics: proprietressProfile.honorifics || 'Proprietress & Visionary',
      title: proprietressProfile.title || 'Founder & Executive Director',
      establishedYear: String(proprietressProfile.establishedYear || '2007'),
      tagline: proprietressProfile.tagline || 'Excellence is not an accident; it is the habit of dedicated mentors and eager minds.'
    });
    setTestimonialHeaderForm(testimonialsHeader);
  }, [schoolInfo, images.crest, proprietressProfile, testimonialsHeader]);

  // Highlight state
  const [highlightsList, setHighlightsList] = useState<string[]>(heroHighlights || []);
  const [newHighlightText, setNewHighlightText] = useState('');

  // Hidden file inputs references
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const founderPhotoInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // 1. Handle School Logo Upload (File from device)
  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingTarget('logo');
      const dataUrl = await compressImageFile(file, 600, 600, 0.9);
      setLogoForm(prev => ({ ...prev, logoUrl: dataUrl }));
      updateSchoolInfo({ logoUrl: dataUrl });
      updateImage('crest', dataUrl);
      showToast('School logo successfully uploaded and applied across all portals!');
    } catch (err) {
      console.error('Error uploading logo file:', err);
    } finally {
      setUploadingTarget(null);
    }
  };

  // 1. Handle Save School Logo & Identity
  const handleSaveLogoAndIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo({
      logoUrl: logoForm.logoUrl,
      name: logoForm.name,
      shortName: logoForm.shortName,
      motto: logoForm.motto,
      city: logoForm.city,
      state: logoForm.state
    });
    updateImage('crest', logoForm.logoUrl || DEFAULT_IMAGES.crest);
    updateAboutContent({
      establishedYear: logoForm.establishedYear
    });
    showToast('School logo and institutional identity updated successfully!');
  };

  // Reset to default Heraldic SVG crest
  const handleResetToDefaultCrest = () => {
    setLogoForm(prev => ({ ...prev, logoUrl: '' }));
    updateSchoolInfo({ logoUrl: '' });
    updateImage('crest', DEFAULT_IMAGES.crest);
    showToast('Restored default heraldic SVG crest emblem.');
  };

  // 2. Generic Image File Upload for any Gallery or Slide item
  const handleGenericImageUpload = async (
    file: File, 
    onSuccess: (dataUrl: string) => void, 
    targetKey: string
  ) => {
    try {
      setUploadingTarget(targetKey);
      const dataUrl = await compressImageFile(file, 1400, 1000, 0.85);
      onSuccess(dataUrl);
      showToast('Image uploaded and optimized successfully!');
    } catch (err) {
      console.error('Failed to compress/upload image:', err);
    } finally {
      setUploadingTarget(null);
    }
  };

  // Add a new Hero Highlight
  const handleAddHighlight = () => {
    if (!newHighlightText.trim()) return;
    const updated = [...highlightsList, newHighlightText.trim()];
    setHighlightsList(updated);
    updateHeroHighlights(updated);
    setNewHighlightText('');
    showToast('Hero highlight bullet point added!');
  };

  const handleRemoveHighlight = (idx: number) => {
    const updated = highlightsList.filter((_, i) => i !== idx);
    setHighlightsList(updated);
    updateHeroHighlights(updated);
    showToast('Hero highlight removed.');
  };

  // Save About Section
  const handleSaveAboutSection = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutContent(aboutForm);
    if (aboutForm.founderPhotoUrl) {
      updateImage('founders', aboutForm.founderPhotoUrl);
    }
    showToast('About section content and Founder profile updated!');
  };

  // Save Contact Section
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo(contactForm);
    showToast('Official contact information and campus desk updated!');
  };

  // Gallery items metadata
  const galleryItems = [
    { key: 'crest', title: 'School Logo / Crest', desc: 'Used in navbar, report cards, ID badges, and portal headers', defaultUrl: DEFAULT_IMAGES.crest },
    { key: 'founders', title: 'Founder & Proprietress Portrait', desc: 'Featured in homepage About section and executive letters', defaultUrl: DEFAULT_IMAGES.founders },
    { key: 'hero', title: 'Hero Banner Main Backdrop', desc: 'Primary landing banner background visual', defaultUrl: DEFAULT_IMAGES.hero },
    { key: 'earlyYears', title: 'Early Years & Crèche Classroom', desc: 'Featured in Academic Programs for Crèche / Nursery', defaultUrl: DEFAULT_IMAGES.earlyYears },
    { key: 'artClass', title: 'Creative Arts & Music Studio', desc: 'Featured in Primary / Junior School creative curriculum', defaultUrl: DEFAULT_IMAGES.artClass },
    { key: 'faculty', title: 'Faculty & Mentors Team', desc: 'Showcases educators and faculty leadership', defaultUrl: DEFAULT_IMAGES.faculty },
    { key: 'sports', title: 'Athletics & Track Sports', desc: 'Inter-house sports and physical education banner', defaultUrl: DEFAULT_IMAGES.sports },
    { key: 'soccer', title: 'Football Field & Team Play', desc: 'Co-curricular sports activities and campus facilities', defaultUrl: DEFAULT_IMAGES.soccer },
    { key: 'cultural', title: 'Cultural Day & Heritage Festivals', desc: 'Cultural day, music performances, and community celebrations', defaultUrl: DEFAULT_IMAGES.cultural },
  ];

  return (
    <div className="space-y-6 font-['Nunito',sans-serif]">
      {/* Top Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 mb-2">
            <Layout className="w-3.5 h-3.5" />
            <span>Complete Website CMS & Asset Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Landing Page & School Media Management
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Update every visual element of your public website: upload the school logo, change hero banner images, configure academic programs, update co-curriculars, and customize institutional copy.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-bold">
            <SchoolLogo size="xs" showText={false} />
            <span className="hidden sm:inline">Active Brand:</span>
            <span className="text-red-700 font-black">{schoolInfo.shortName || 'Stanbax'}</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-md animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSaveSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs underline font-black"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Horizontal Scrollable Sub-tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab('theme')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'theme'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Website Themes (3 Styles)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('logo')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'logo'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <SchoolIcon className="w-4 h-4" />
          <span>School Logo & Crest</span>
          {logoForm.logoUrl && <span className="w-2 h-2 rounded-full bg-amber-300" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('hero')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'hero'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Hero Banner & Slides</span>
          <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px]">
            {heroSlides.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('about')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'about'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>About & Founder Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('programs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'programs'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Academic Programs</span>
          <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px]">
            {academicPrograms.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('pillars')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'pillars'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Key Pillars</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('gallery')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'gallery'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Website Media Gallery</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('student_life')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'student_life'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Student Life & Clubs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('faculty')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'faculty'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty & Leadership</span>
          <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px]">
            {facultyList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('calendar')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'calendar'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Academic Calendar</span>
          <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px]">
            {calendarEvents.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('notices')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'notices'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Official Bulletins & Notices</span>
          <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px]">
            {notices.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('testimonials')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'testimonials'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reviews & Testimonials</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('faq')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'faq'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQ Questions</span>
          <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px]">
            {faqItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('contact')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'contact'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact & Hours</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('footer')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'footer'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Footer & Social Links</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 0. TAB: WEBSITE THEME STUDIO (3 BESPOKE UNIQUE THEMES)                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'theme' && (
        <div className="space-y-6">
          {themeSaveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-bold">
                  Website theme successfully updated and applied across all public pages and portals!
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setThemeSaveSuccess(false)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Color & Visual Identity Engine</span>
                </div>
                <h3 className="text-xl font-black text-stone-900">
                  Select Institutional Website Theme (3 Unique Styles)
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
                  Transform the visual aesthetic, color contrast, header bars, and hero gradient across the entire school platform. Changes take effect instantly for all visitors and portal users.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-stone-400 font-bold">Current Active:</span>
                <span className="px-3 py-1 rounded-xl bg-stone-900 text-amber-300 font-black text-xs shadow-xs uppercase tracking-wider">
                  {selectedTheme.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* 3 Unique Theme Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WEBSITE_THEMES.map((th: ThemeConfig) => {
                const isActive = selectedTheme === th.id;

                return (
                  <div
                    key={th.id}
                    className={`relative rounded-3xl p-5 border-2 transition-all duration-300 flex flex-col justify-between ${
                      isActive 
                        ? 'border-blue-600 bg-blue-50/20 shadow-xl ring-4 ring-blue-500/15 scale-[1.01]' 
                        : 'border-stone-200 hover:border-stone-300 bg-white shadow-xs hover:shadow-md'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                        <Check className="w-3 h-3" />
                        <span>Active Website Theme</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Theme Preview Swatch Bar */}
                      <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-inner">
                        <div className={`h-24 bg-gradient-to-r ${th.previewBg} p-4 flex flex-col justify-between text-white relative`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                              {th.badge}
                            </span>
                            <div className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center text-[10px] font-bold">
                              SB
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-black tracking-tight text-white line-clamp-1">Stanbax Schools</p>
                            <p className="text-[10px] text-white/80 line-clamp-1">{th.tagline}</p>
                          </div>
                        </div>

                        {/* Palette Color Dots */}
                        <div className="bg-stone-50 p-3 flex items-center justify-between border-t border-stone-100">
                          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Palette</span>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: th.primaryColor }} title="Primary" />
                            <div className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: th.secondaryColor }} title="Dark Secondary" />
                            <div className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: th.accentColor }} title="Accent Red/Green" />
                            <div className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: th.goldColor }} title="Imperial Gold" />
                            <div className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: th.bgBase }} title="Canvas Background" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <h4 className="text-base font-extrabold text-stone-900">{th.name}</h4>
                        <p className="text-xs font-semibold text-stone-500 mt-0.5">{th.tagline}</p>
                        <p className="text-xs text-stone-600 leading-relaxed mt-2.5">
                          {th.description}
                        </p>
                      </div>

                      {/* Theme Key Attributes */}
                      <div className="bg-stone-50 rounded-2xl p-3 space-y-1.5 text-[11px] text-stone-600">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-500">Tone:</span>
                          <span className="font-bold text-stone-800">
                            {th.id === 'royal-navy' ? 'Oxford Heritage & British Classic' :
                             th.id === 'emerald-gold' ? 'Prestigious Ivy & Vitality' : 'Modern Luxury & Ivy League'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-500">Canvas Base:</span>
                          <span className="font-mono text-[10px] text-stone-800">{th.bgBase}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-500">Primary Crest:</span>
                          <span className="font-mono text-[10px] text-stone-800">{th.primaryColor}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-5 mt-2">
                      <button
                        type="button"
                        onClick={() => handleApplyTheme(th.id)}
                        disabled={isActive}
                        className={`w-full py-3 px-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                          isActive
                            ? 'bg-blue-600 text-white cursor-default'
                            : 'bg-stone-900 hover:bg-stone-800 text-white hover:shadow-md'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Currently Active on Website</span>
                          </>
                        ) : (
                          <>
                            <Sliders className="w-3.5 h-3.5 text-amber-300" />
                            <span>Apply & Switch to This Theme</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TAB: SCHOOL LOGO & BRAND IDENTITY STUDIO (PRIMARY FOCUS)              */}
      {/* ========================================================================= */}
      {activeSubTab === 'logo' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveLogoAndIdentity} className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                    <SchoolIcon className="w-5 h-5 text-red-600" />
                    Official School Logo & Heraldic Crest
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Upload your institution's custom crest or logo. It updates dynamically across the Navbar, Footer, Scholar ID Cards, Terminal Report Sheets, Entrance Slips, and all Portals.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetToDefaultCrest}
                    className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore Default Crest
                  </button>
                </div>
              </div>

              {/* Logo Upload & URL Box */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Interactive Preview & Upload Box */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 text-center">
                  <div className="relative group mb-4">
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-white shadow-lg border-4 border-amber-400 flex items-center justify-center p-1 relative">
                      {logoForm.logoUrl ? (
                        <img 
                          src={logoForm.logoUrl} 
                          alt="School Logo Preview" 
                          className="w-full h-full object-contain rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full">
                          <SchoolLogo size="xl" showText={false} />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer"
                    >
                      <Upload className="w-5 h-5 mb-1 text-amber-300" />
                      Change Logo
                    </button>
                  </div>

                  <input 
                    type="file"
                    ref={logoFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoFileUpload}
                  />

                  <div className="space-y-2 w-full">
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      disabled={uploadingTarget === 'logo'}
                      className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploadingTarget === 'logo' ? 'Compressing & Storing...' : 'Upload Logo from Phone / PC'}</span>
                    </button>
                    <p className="text-[11px] text-stone-500">
                      Supports PNG, JPG, WebP, SVG. Auto-compressed for instant loading.
                    </p>
                  </div>
                </div>

                {/* Right: Manual URL & Settings */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Direct Logo Image URL (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="url"
                        value={logoForm.logoUrl}
                        onChange={(e) => setLogoForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                        placeholder="https://example.com/school-logo.png"
                        className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 font-mono"
                      />
                      {logoForm.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setLogoForm(prev => ({ ...prev, logoUrl: '' }))}
                          className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50"
                          title="Clear URL"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Tip: You can upload directly via the button on the left, or paste any image link here.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Official School Name</label>
                      <input 
                        type="text"
                        value={logoForm.name}
                        onChange={(e) => setLogoForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Short Brand Name</label>
                      <input 
                        type="text"
                        value={logoForm.shortName}
                        onChange={(e) => setLogoForm(prev => ({ ...prev, shortName: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">Official Motto / Slogan</label>
                      <input 
                        type="text"
                        value={logoForm.motto}
                        onChange={(e) => setLogoForm(prev => ({ ...prev, motto: e.target.value }))}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Established Heritage Year</label>
                      <input 
                        type="text"
                        value={logoForm.establishedYear}
                        onChange={(e) => setLogoForm(prev => ({ ...prev, establishedYear: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Campus Location</label>
                      <input 
                        type="text"
                        value={`${logoForm.city}, ${logoForm.state}`}
                        onChange={(e) => {
                          const parts = e.target.value.split(',');
                          setLogoForm(prev => ({
                            ...prev,
                            city: parts[0]?.trim() || prev.city,
                            state: parts[1]?.trim() || prev.state
                          }));
                        }}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Surface Live Previews */}
              <div className="pt-6 border-t border-stone-100">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  Live Real-World Visual Previews:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Preview 1: Light Header Navbar */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                      1. Website Navbar (Light)
                    </span>
                    <div className="py-2">
                      <SchoolLogo size="sm" />
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold mt-2">✓ Rendered on Homepage</span>
                  </div>

                  {/* Preview 2: Dark Footer Banner */}
                  <div className="p-4 rounded-2xl bg-[#111827] text-white border border-stone-800 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-2">
                      2. Dark Theme / Footer
                    </span>
                    <div className="py-2">
                      <SchoolLogo size="sm" variant="light" />
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold mt-2">✓ Rendered on Footer</span>
                  </div>

                  {/* Preview 3: Terminal Report Card Letterhead */}
                  <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-amber-200 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-2">
                      3. Report Sheet & ID Stamp
                    </span>
                    <div className="py-1 flex items-center justify-center">
                      <SchoolLogo size="md" showText={false} />
                    </div>
                    <div className="text-[10px] text-center text-stone-700 font-black mt-1">
                      {logoForm.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save School Logo & Brand Identity</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: HERO BANNER & SLIDES                                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-red-600" />
                  Homepage Hero Banner Carousel
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Configure the prominent full-width carousel slides and backgrounds displayed at the top of your school's website.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetHeroSlidesToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Slides
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newSlide: HeroSlide = {
                      id: `slide-${Date.now()}`,
                      badge: 'New Academic Program',
                      title: 'Inspiring Future Innovators & Leaders',
                      subtitle: 'World-class facilities and nurturing mentorship located in the heart of Oyo State.',
                      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80',
                      ctaText: 'Apply for Admission',
                      ctaAction: 'apply'
                    };
                    addHeroSlide(newSlide);
                    showToast('New hero slide added!');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Slide
                </button>
              </div>
            </div>

            {/* Slides List */}
            <div className="space-y-6">
              {heroSlides.map((slide, idx) => (
                <div key={idx} className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-amber-400 text-neutral-950 text-xs font-black rounded-lg">
                      Slide #{idx + 1}
                    </span>
                    {heroSlides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          deleteHeroSlide(idx);
                          showToast(`Hero slide #${idx + 1} deleted.`);
                        }}
                        className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Slide Image Preview & Upload */}
                    <div className="lg:col-span-4 space-y-2">
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-stone-300 shadow-inner group">
                        <img 
                          src={slide.imageUrl || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80'} 
                          alt={`Slide ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                          <Upload className="w-5 h-5 mb-1 text-amber-300" />
                          <span>Upload Banner Image</span>
                          <input 
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleGenericImageUpload(file, (dataUrl) => {
                                  updateHeroSlide(idx, { imageUrl: dataUrl });
                                }, `hero_slide_${idx}`);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-stone-600">
                          Slide Image URL / Source
                        </label>
                        <input 
                          type="url"
                          value={slide.imageUrl}
                          onChange={(e) => updateHeroSlide(idx, { imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-red-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Slide Texts */}
                    <div className="lg:col-span-8 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Slide Pill Badge</label>
                          <input 
                            type="text"
                            value={slide.badge}
                            onChange={(e) => updateHeroSlide(idx, { badge: e.target.value })}
                            className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">CTA Button Label</label>
                          <input 
                            type="text"
                            value={slide.ctaText}
                            onChange={(e) => updateHeroSlide(idx, { ctaText: e.target.value })}
                            className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Headline Title</label>
                        <input 
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateHeroSlide(idx, { title: e.target.value })}
                          className="w-full px-3 py-2 text-sm font-extrabold bg-white border border-stone-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle / Narrative</label>
                        <textarea 
                          rows={2}
                          value={slide.subtitle}
                          onChange={(e) => updateHeroSlide(idx, { subtitle: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hero Key Highlights Bullet Points */}
            <div className="pt-6 border-t border-stone-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-stone-900">
                    Hero Highlights Bar (Checkmark Bullet Points)
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Fast visual trust points displayed directly below the hero banner.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetHeroHighlightsToDefault}
                  className="text-xs text-stone-500 hover:text-stone-700 underline"
                >
                  Reset Bullet Points
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {highlightsList.map((hl, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-stone-900 border border-amber-300 rounded-xl text-xs font-bold"
                  >
                    <Check className="w-3.5 h-3.5 text-red-600" />
                    <span>{hl}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveHighlight(i)}
                      className="ml-1 text-stone-400 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text"
                  value={newHighlightText}
                  onChange={(e) => setNewHighlightText(e.target.value)}
                  placeholder="e.g., 100% WAEC & BECE Distinctions in Oyo State"
                  className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl"
                >
                  Add Bullet Point
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: ABOUT SECTION & PROPRIETRESS PROFILE                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'about' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveAboutSection} className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-red-600" />
                    About Stanbax & Proprietress Showcase
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Manage the institutional story, core vision, mission statements, and Founder portrait photo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetAboutContentToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>

              {/* Founder Photo & Quote Card */}
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
                  <div className="relative group w-40 h-48 rounded-2xl overflow-hidden shadow-md border-2 border-amber-400 bg-stone-200">
                    <img 
                      src={aboutForm.founderPhotoUrl || images.founders || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'}
                      alt="Founder Portrait"
                      className="w-full h-full object-cover object-top"
                    />
                    <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                      <Upload className="w-5 h-5 mb-1 text-amber-300" />
                      <span>Change Photo</span>
                      <input 
                        type="file"
                        ref={founderPhotoInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericImageUpload(file, (dataUrl) => {
                              setAboutForm(prev => ({ ...prev, founderPhotoUrl: dataUrl }));
                              updateImage('founders', dataUrl);
                            }, 'founder_photo');
                          }
                        }}
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => founderPhotoInputRef.current?.click()}
                    disabled={uploadingTarget === 'founder_photo'}
                    className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Portrait</span>
                  </button>
                </div>

                <div className="md:col-span-8 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Founder / Proprietress Name</label>
                      <input 
                        type="text"
                        value={aboutForm.founderName}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, founderName: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Official Role / Designation</label>
                      <input 
                        type="text"
                        value={aboutForm.founderRole}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, founderRole: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Founder's Personal Quote</label>
                    <input 
                      type="text"
                      value={aboutForm.quote || ''}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, quote: e.target.value }))}
                      placeholder="Excellence is not an accident; it is the habit of dedicated mentors and eager minds."
                      className="w-full px-3 py-2 text-xs italic bg-white border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Photo Image URL</label>
                    <input 
                      type="url"
                      value={aboutForm.founderPhotoUrl || ''}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, founderPhotoUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* General About Section Narrative */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Section Badge</label>
                  <input 
                    type="text"
                    value={aboutForm.badge}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Section Main Title</label>
                  <input 
                    type="text"
                    value={aboutForm.title}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Institutional Narrative</label>
                  <textarea 
                    rows={4}
                    value={aboutForm.description}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Vision Statement</label>
                  <textarea 
                    rows={3}
                    value={aboutForm.vision}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, vision: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Mission Statement</label>
                  <textarea 
                    rows={3}
                    value={aboutForm.mission}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, mission: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save About Section</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: ACADEMIC PROGRAMS & LEVELS                                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'programs' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-600" />
                  Academic Pathways & Program Cards
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Customize the section header, the 4 primary academic tiers (Crèche/Early Years, Primary, JSS, SSS), cover photos, curriculum features, and scholar capacities.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAcademicProgramsToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Section Header Controls */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
              <div className="text-xs font-black text-amber-950 flex items-center justify-between">
                <span>Section Header (Headline & Intro)</span>
                <button
                  type="button"
                  onClick={() => showToast('Academic programs header saved!')}
                  className="px-3 py-1 bg-amber-500 text-stone-950 text-[11px] font-black rounded-lg hover:bg-amber-400 cursor-pointer"
                >
                  Save Header
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Badge Pill</label>
                  <input
                    type="text"
                    value={schoolInfo.programsHeader?.badge || 'Curriculum & Academics'}
                    onChange={(e) => updateSchoolInfo({
                      programsHeader: {
                        ...(schoolInfo.programsHeader || {}),
                        badge: e.target.value
                      }
                    })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Main Heading</label>
                  <input
                    type="text"
                    value={schoolInfo.programsHeader?.title || 'Academic Pathways at Stanbax Schools'}
                    onChange={(e) => updateSchoolInfo({
                      programsHeader: {
                        ...(schoolInfo.programsHeader || {}),
                        title: e.target.value
                      }
                    })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={schoolInfo.programsHeader?.subtitle || 'Structured for all age tiers from early childhood through college graduation, integrating national benchmarks with international enrichment.'}
                    onChange={(e) => updateSchoolInfo({
                      programsHeader: {
                        ...(schoolInfo.programsHeader || {}),
                        subtitle: e.target.value
                      }
                    })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {academicPrograms.map((prog, idx) => (
                <div key={prog.id || idx} className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Program Image Preview & Upload */}
                    <div className="relative rounded-xl overflow-hidden h-44 border border-stone-300 shadow-inner group">
                      <img 
                        src={prog.imageUrl || (prog.imageKey && images[prog.imageKey]) || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80'}
                        alt={prog.title}
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                        <Upload className="w-5 h-5 mb-1 text-amber-300" />
                        <span>Change Program Photo</span>
                        <input 
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleGenericImageUpload(file, (dataUrl) => {
                                updateAcademicProgram(prog.id, { imageUrl: dataUrl });
                              }, `prog_photo_${prog.id}`);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Program Title</label>
                        <input 
                          type="text"
                          value={prog.title}
                          onChange={(e) => updateAcademicProgram(prog.id, { title: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs font-bold bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Category</label>
                        <input 
                          type="text"
                          value={prog.category || ''}
                          onChange={(e) => updateAcademicProgram(prog.id, { category: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Age Tier</label>
                        <input 
                          type="text"
                          value={prog.ageGroup || prog.ageRange || ''}
                          onChange={(e) => updateAcademicProgram(prog.id, { ageGroup: e.target.value, ageRange: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Scholar Enrollment</label>
                        <input 
                          type="text"
                          value={prog.studentCount || ''}
                          onChange={(e) => updateAcademicProgram(prog.id, { studentCount: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Description</label>
                      <textarea 
                        rows={2}
                        value={prog.description}
                        onChange={(e) => updateAcademicProgram(prog.id, { description: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Custom Image URL</label>
                      <input 
                        type="url"
                        value={prog.imageUrl || ''}
                        onChange={(e) => updateAcademicProgram(prog.id, { imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-stone-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500 font-bold">
                    <span>{prog.features?.length || 0} Curriculum Highlights</span>
                    <button
                      type="button"
                      onClick={() => showToast(`Program "${prog.title}" updated!`)}
                      className="px-3 py-1 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Specialty Enrichment Programs & Co-Curricular Clubs */}
            <div className="pt-8 border-t border-stone-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-black text-stone-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-red-600" />
                    <span>Co-Curricular & Enrichment Specialty Clubs</span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Customize the hands-on practical clubs displayed at the bottom of the Academic Programs section (Robotics, Diction, Creative Arts, etc.).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetFeaturedCoursesToDefault}
                    className="px-3 py-1.5 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Clubs
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newCourse: FeaturedCourse = {
                        id: `fc-${Date.now()}`,
                        title: 'Modern Coding & App Development',
                        level: 'Upper Primary & JSS',
                        grade: 'Basic 4 – JSS 3',
                        highlight: 'Hands-on Python coding, web animation, logic blocks, and creative algorithms.',
                        description: 'App building and computational thinking.',
                        tutor: 'Mr. Babatunde Adekunle',
                        students: '30 Scholars',
                        duration: '2 hrs / week',
                        highlights: ['Python fundamentals', 'Visual block logic', 'Web portfolio project'],
                        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'
                      };
                      addFeaturedCourse(newCourse);
                      showToast('New specialty enrichment club added!');
                    }}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Specialty Club
                  </button>
                </div>
              </div>

              {/* Enrichment Section Header Controls */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="text-xs font-black text-stone-800 flex items-center justify-between">
                  <span>Enrichment Section Heading & Intro</span>
                  <button
                    type="button"
                    onClick={() => {
                      updateSchoolInfo({
                        enrichmentHeader: enrichmentHeaderForm
                      });
                      showToast('Enrichment header updated!');
                    }}
                    className="px-3 py-1 bg-red-600 text-white text-[11px] font-black rounded-lg hover:bg-red-700 cursor-pointer"
                  >
                    Save Heading
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Badge Pill</label>
                    <input
                      type="text"
                      value={enrichmentHeaderForm.badge}
                      onChange={(e) => setEnrichmentHeaderForm(prev => ({ ...prev, badge: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Main Heading</label>
                    <input
                      type="text"
                      value={enrichmentHeaderForm.title}
                      onChange={(e) => setEnrichmentHeaderForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Subtitle / Summary</label>
                    <textarea
                      rows={2}
                      value={enrichmentHeaderForm.subtitle}
                      onChange={(e) => setEnrichmentHeaderForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Enrichment Courses Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(featuredCourses || []).map((course) => (
                  <div key={course.id} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Photo preview with upload */}
                      <div className="relative rounded-xl overflow-hidden h-36 border border-stone-200 group bg-stone-100">
                        <img 
                          src={course.imageUrl || (course.imageKey && images[course.imageKey]) || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80'}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                          <Upload className="w-4 h-4 mb-1 text-amber-300" />
                          <span>Change Photo</span>
                          <input 
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleGenericImageUpload(file, (dataUrl) => {
                                  updateFeaturedCourse(course.id, { imageUrl: dataUrl });
                                }, `course_photo_${course.id}`);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Course Photo URL</label>
                        <input
                          type="url"
                          value={course.imageUrl || ''}
                          onChange={(e) => updateFeaturedCourse(course.id, { imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-2 py-1 text-[11px] font-mono bg-stone-50 border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Club / Course Title</label>
                        <input 
                          type="text"
                          value={course.title}
                          onChange={(e) => updateFeaturedCourse(course.id, { title: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs font-bold bg-stone-50 border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Grade Tier</label>
                          <input 
                            type="text"
                            value={course.grade || ''}
                            onChange={(e) => updateFeaturedCourse(course.id, { grade: e.target.value })}
                            placeholder="e.g. Basic 4 – SSS 3"
                            className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Duration</label>
                          <input 
                            type="text"
                            value={course.duration || ''}
                            onChange={(e) => updateFeaturedCourse(course.id, { duration: e.target.value })}
                            placeholder="e.g. 2 hrs / week"
                            className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Lead Instructor</label>
                          <input 
                            type="text"
                            value={course.tutor || ''}
                            onChange={(e) => updateFeaturedCourse(course.id, { tutor: e.target.value })}
                            placeholder="Instructor Name"
                            className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Participation</label>
                          <input 
                            type="text"
                            value={String(course.students || '')}
                            onChange={(e) => updateFeaturedCourse(course.id, { students: e.target.value })}
                            placeholder="e.g. 48 Scholars"
                            className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Highlight Summary</label>
                        <textarea 
                          rows={2}
                          value={course.highlight || course.description || ''}
                          onChange={(e) => updateFeaturedCourse(course.id, { highlight: e.target.value, description: e.target.value })}
                          className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          deleteFeaturedCourse(course.id);
                          showToast(`Removed "${course.title}".`);
                        }}
                        className="text-stone-400 hover:text-red-600 text-xs flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`Enrichment club "${course.title}" updated!`)}
                        className="px-3 py-1 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-stone-800 cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: KEY PILLARS OF EXCELLENCE                                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'pillars' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                  Key Pillars of Excellence
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage the core pillars that explain why parents choose Stanbax Schools.
                </p>
              </div>

              <button
                type="button"
                onClick={resetKeyPillarsToDefault}
                className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>
            </div>

            {/* Header copy */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Section Badge</label>
                <input 
                  type="text"
                  value={pillarHeaderForm.badge}
                  onChange={(e) => {
                    const updated = { ...pillarHeaderForm, badge: e.target.value };
                    setPillarHeaderForm(updated);
                    updateKeyPillarsHeader(updated);
                  }}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Section Main Headline</label>
                <input 
                  type="text"
                  value={pillarHeaderForm.title}
                  onChange={(e) => {
                    const updated = { ...pillarHeaderForm, title: e.target.value };
                    setPillarHeaderForm(updated);
                    updateKeyPillarsHeader(updated);
                  }}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle / Context</label>
                <input 
                  type="text"
                  value={pillarHeaderForm.subtitle}
                  onChange={(e) => {
                    const updated = { ...pillarHeaderForm, subtitle: e.target.value };
                    setPillarHeaderForm(updated);
                    updateKeyPillarsHeader(updated);
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {keyPillars.map((pillar) => (
                <div key={pillar.id} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-700 uppercase tracking-wider">
                      Icon: {pillar.iconName}
                    </span>
                    <select
                      value={pillar.iconName}
                      onChange={(e) => updateKeyPillar(pillar.id, { iconName: e.target.value })}
                      className="px-2 py-1 text-xs font-bold bg-stone-100 border border-stone-300 rounded-lg"
                    >
                      <option value="GraduationCap">GraduationCap</option>
                      <option value="FlaskConical">FlaskConical</option>
                      <option value="BookOpen">BookOpen</option>
                      <option value="ShieldCheck">ShieldCheck</option>
                      <option value="Award">Award</option>
                      <option value="School">School</option>
                      <option value="HeartHandshake">HeartHandshake</option>
                      <option value="CheckCircle2">CheckCircle2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Pillar Title</label>
                    <input 
                      type="text"
                      value={pillar.title}
                      onChange={(e) => updateKeyPillar(pillar.id, { title: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                    <textarea 
                      rows={2}
                      value={pillar.description || pillar.desc || ''}
                      onChange={(e) => updateKeyPillar(pillar.id, { description: e.target.value, desc: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: WEBSITE MEDIA GALLERY (ALL PUBLIC IMAGES)                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-red-600" />
                  Website Media Gallery & Global Image Assets
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Direct visual control over every photograph and graphic displayed on the public landing page. Upload from your phone camera or enter high-resolution image links.
                </p>
              </div>

              <button
                type="button"
                onClick={resetImagesToDefault}
                className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Images to Default
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => {
                const currentImg = images[item.key] || item.defaultUrl;
                return (
                  <div 
                    key={item.key} 
                    className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-stone-300 shadow-inner group mb-3">
                        <img 
                          src={currentImg} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                          <Upload className="w-5 h-5 mb-1 text-amber-300" />
                          <span>Replace Image</span>
                          <input 
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleGenericImageUpload(file, (dataUrl) => {
                                  updateImage(item.key, dataUrl);
                                  if (item.key === 'crest') {
                                    updateSchoolInfo({ logoUrl: dataUrl });
                                  }
                                }, item.key);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <h4 className="text-xs font-black text-stone-900">{item.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{item.desc}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-stone-200">
                      <input 
                        type="url"
                        value={images[item.key] || ''}
                        onChange={(e) => {
                          updateImage(item.key, e.target.value);
                          if (item.key === 'crest') {
                            updateSchoolInfo({ logoUrl: e.target.value });
                          }
                        }}
                        placeholder={item.defaultUrl}
                        className="w-full px-2.5 py-1 text-[11px] font-mono bg-white border border-stone-300 rounded-lg"
                      />

                      <div className="flex items-center justify-between gap-2">
                        <label className="flex-1 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg text-center cursor-pointer flex items-center justify-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>Upload File</span>
                          <input 
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleGenericImageUpload(file, (dataUrl) => {
                                  updateImage(item.key, dataUrl);
                                  if (item.key === 'crest') {
                                    updateSchoolInfo({ logoUrl: dataUrl });
                                  }
                                }, item.key);
                              }
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            updateImage(item.key, item.defaultUrl);
                            showToast(`Reset ${item.title} to default image.`);
                          }}
                          className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200"
                          title="Reset this image"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Campus Facilities & Events Photo Database Studio */}
            <div className="pt-8 border-t border-stone-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-black text-stone-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-red-600" />
                    <span>Campus Facilities, Sports & Events Photo Database</span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Upload new photography, organize facilities by category (Facilities, Sports, Events, Arts, Academics), and customize captions displayed in the Campus Gallery.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <CampusGallery showAdminControls={true} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: STUDENT LIFE & CO-CURRICULARS                                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'student_life' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-red-600" />
                  Student Life, Inter-House Sports & Clubs
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage the section headers, the 3 visual feature cards (Sports, Cultural Day, STEM Studio), co-curricular student clubs, and inter-house standings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetClubsToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Clubs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newClub: Club = {
                      id: `club-${Date.now()}`,
                      name: 'STEM & Robotics Guild',
                      category: 'Technology',
                      meetingDay: 'Fridays 3:00 PM',
                      patron: 'Engr. D. Adeleke',
                      description: 'Hands-on coding, circuitry, and regional robotic competitions.'
                    };
                    addClub(newClub);
                    showToast('New student club added!');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Club
                </button>
              </div>
            </div>

            {/* Section Header Controls */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
              <div className="text-xs font-black text-amber-950 flex items-center justify-between">
                <span>Section Header (Headline & Intro)</span>
                <button
                  type="button"
                  onClick={() => {
                    updateSchoolInfo({
                      studentLifeHeader: {
                        ...(schoolInfo.studentLifeHeader || {}),
                        badge: studentLifeHighlights.badge,
                        title: studentLifeHighlights.title,
                        subtitle: studentLifeHighlights.subtitle
                      }
                    });
                    showToast('Student Life section header updated!');
                  }}
                  className="px-3 py-1 bg-amber-500 text-stone-950 text-[11px] font-black rounded-lg hover:bg-amber-400 cursor-pointer"
                >
                  Save Header
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Badge Pill</label>
                  <input
                    type="text"
                    value={studentLifeHighlights.badge}
                    onChange={(e) => setStudentLifeHighlights(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Main Heading</label>
                  <input
                    type="text"
                    value={studentLifeHighlights.title}
                    onChange={(e) => setStudentLifeHighlights(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={studentLifeHighlights.subtitle}
                    onChange={(e) => setStudentLifeHighlights(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Student Life 3 Highlight Photo Cards Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-stone-900">Student Life Photo Highlight Cards</h4>
                  <p className="text-[11px] text-stone-500">The 3 prominent photography banners displayed directly beneath the section header.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    updateSchoolInfo({
                      studentLifeHeader: {
                        ...(schoolInfo.studentLifeHeader || {}),
                        ...studentLifeHighlights
                      }
                    });
                    if (studentLifeHighlights.sportsPhotoUrl) updateImage('sports', studentLifeHighlights.sportsPhotoUrl);
                    if (studentLifeHighlights.culturalPhotoUrl) updateImage('cultural', studentLifeHighlights.culturalPhotoUrl);
                    if (studentLifeHighlights.artPhotoUrl) updateImage('artClass', studentLifeHighlights.artPhotoUrl);
                    showToast('Student life photo cards updated successfully!');
                  }}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Photo Cards
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Highlight Card 1: Sports */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="relative rounded-xl overflow-hidden h-36 border border-stone-300 group">
                    <img 
                      src={studentLifeHighlights.sportsPhotoUrl || images.sports || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80'}
                      alt="Sports"
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                      <Upload className="w-4 h-4 mb-1 text-amber-300" />
                      <span>Upload Sports Photo</span>
                      <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericImageUpload(file, (dataUrl) => {
                              setStudentLifeHighlights(prev => ({ ...prev, sportsPhotoUrl: dataUrl }));
                              updateImage('sports', dataUrl);
                              updateSchoolInfo({
                                studentLifeHeader: {
                                  ...(schoolInfo.studentLifeHeader || {}),
                                  sportsPhotoUrl: dataUrl
                                }
                              });
                            }, 'sports_photo');
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Photo URL</label>
                    <input 
                      type="url"
                      value={studentLifeHighlights.sportsPhotoUrl}
                      onChange={(e) => setStudentLifeHighlights(prev => ({ ...prev, sportsPhotoUrl: e.target.value }))}
                      className="w-full px-2 py-1 text-[11px] font-mono bg-white border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Badge Pill</label>
                    <input 
                      type="text"
                      value={studentLifeHighlights.sportsBadge}
                      onChange={(e) => setStudentLifeHighlights(prev => ({ ...prev, sportsBadge: e.target.value }))}
                      className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Card Heading</label>
                    <input 
                      type="text"
                      value={studentLifeHighlights.sportsTitle}
                      onChange={(e) => setStudentLifeHighlights(prev => ({ ...prev, sportsTitle: e.target.value }))}
                      className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded-lg font-bold"
                    />
                  </div>
                </div>

                {/* Highlight Card 2: Cultural */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="relative rounded-xl overflow-hidden h-36 border border-stone-300 group">
                    <img 
                      src={studentLifeHighlights.culturalPhotoUrl || images.cultural || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80'}
                      alt="Cultural Day"
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                      <Upload className="w-4 h-4 mb-1 text-amber-300" />
                      <span>Upload Cultural Photo</span>
                      <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericImageUpload(file, (dataUrl) => {
                              setStudentLifeHighlights(prev => ({ ...prev, culturalPhotoUrl: dataUrl }));
                              updateImage('cultural', dataUrl);
                              updateSchoolInfo({
                                studentLifeHeader: {
                                  ...(schoolInfo.studentLifeHeader || {}),
                                  culturalPhotoUrl: dataUrl
                                }
                              });
                            }, 'cultural_photo');
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Photo URL</label>
                    <input 
                      type="url"
                      value={studentLifeHighlights.culturalPhotoUrl}
                      onChange={(e) => setStudentLifeHighlights(prev => ({ ...prev, culturalPhotoUrl: e.target.value }))}
                      className="w-full px-2 py-1 text-[11px] font-mono bg-white border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Badge Pill</label>
                    <input 
                      type="text"
                      value={studentLifeHighlights.culturalBadge}
                      onChange={(e) => setStudentLifeHighlights(prev => ({ ...prev, culturalBadge: e.target.value }))}
                      className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Card Heading</label>
                    <input 
                      type="text"
                      value={studentLifeHighlights.culturalTitle}
                      onChange={(e) => setStudentLifeHighlights(prev => ({ ...prev, culturalTitle: e.target.value }))}
                      className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded-lg font-bold"
                    />
                  </div>
                </div>

                {/* Highlight Card 3: Creative Arts & STEM */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="relative rounded-xl overflow-hidden h-36 border border-stone-300 group">
                    <img 
                      src={studentLifeHighlights.artPhotoUrl || images.artClass || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80'}
                      alt="Creative Arts & STEM"
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                      <Upload className="w-4 h-4 mb-1 text-amber-300" />
                      <span>Upload Arts/STEM Photo</span>
                      <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericImageUpload(file, (dataUrl) => {
                              setStudentLifeHighlights(prev => ({ ...prev, artPhotoUrl: dataUrl }));
                              updateImage('artClass', dataUrl);
                              updateSchoolInfo({
                                studentLifeHeader: {
                                  ...(schoolInfo.studentLifeHeader || {}),
                                  artPhotoUrl: dataUrl
                                }
                              });
                            }, 'art_photo');
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Photo URL</label>
                    <input 
                      type="url"
                      value={studentLifeHighlights.artPhotoUrl}
                      onChange={(e) => setStudentLifeHighlights(prev => ({ ...prev, artPhotoUrl: e.target.value }))}
                      className="w-full px-2 py-1 text-[11px] font-mono bg-white border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Badge Pill</label>
                    <input 
                      type="text"
                      value={studentLifeHighlights.artBadge}
                      onChange={(e) => setStudentLifeHighlights(prev => ({ ...prev, artBadge: e.target.value }))}
                      className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Card Heading</label>
                    <input 
                      type="text"
                      value={studentLifeHighlights.artTitle}
                      onChange={(e) => setStudentLifeHighlights(prev => ({ ...prev, artTitle: e.target.value }))}
                      className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded-lg font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubs.map((c) => (
                <div key={c.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <input 
                        type="text"
                        value={c.name}
                        onChange={(e) => updateClub(c.id, { name: e.target.value })}
                        className="text-xs font-black bg-white border border-stone-300 rounded-lg px-2 py-1 flex-1 mr-2"
                      />
                      <button
                        type="button"
                        onClick={() => deleteClub(c.id)}
                        className="text-stone-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text"
                        value={c.category}
                        onChange={(e) => updateClub(c.id, { category: e.target.value })}
                        placeholder="Category"
                        className="text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                      />
                      <input 
                        type="text"
                        value={c.meetingDay}
                        onChange={(e) => updateClub(c.id, { meetingDay: e.target.value })}
                        placeholder="Meeting Schedule"
                        className="text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                      />
                    </div>

                    <textarea 
                      rows={2}
                      value={c.description}
                      onChange={(e) => updateClub(c.id, { description: e.target.value })}
                      className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2"
                    />

                    {/* President & Vice President Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-stone-200">
                      <div>
                        <label className="block text-[10px] font-black text-amber-700 mb-0.5">👑 President:</label>
                        <select
                          value={c.presidentStudentId || ''}
                          onChange={(e) => assignClubLeaders(c.id, e.target.value || undefined, c.vicePresidentStudentId, c.memberStudentIds)}
                          className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1 font-semibold"
                        >
                          <option value="">-- No President --</option>
                          {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-emerald-700 mb-0.5">👑 Vice President:</label>
                        <select
                          value={c.vicePresidentStudentId || ''}
                          onChange={(e) => assignClubLeaders(c.id, c.presidentStudentId, e.target.value || undefined, c.memberStudentIds)}
                          className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1 font-semibold"
                        >
                          <option value="">-- No Vice President --</option>
                          {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* House Standings */}
            <div className="pt-6 border-t border-stone-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Inter-House Sports Standings & Teams</span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Create, edit or delete official athletic houses. Changes immediately update the public landing page, scholar portals, ID cards, and athletic standings across Stanbax.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={resetHouseStandingsToDefault}
                    className="px-3 py-1.5 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Houses
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newHouse: HouseStanding = {
                        name: `Diamond (White House)`,
                        color: '#475569',
                        points: 1200,
                        motto: 'Purity, Strength & Resilience',
                        houseMaster: 'Mr. David Adeleke'
                      };
                      addHouseStanding(newHouse);
                      showToast('New athletic house created successfully!');
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Create House Team
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {houseStandings.map((h) => (
                  <div key={h.name} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: h.color }} />
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={h.name}
                          onChange={(e) => updateHouseStanding(h.name, { name: e.target.value })}
                          className="text-xs font-black bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 flex-1"
                          placeholder="House Name"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${h.name}?`)) {
                              deleteHouseStanding(h.name);
                              showToast(`Deleted ${h.name}`);
                            }
                          }}
                          className="text-stone-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                          title="Delete House"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Points</label>
                          <input 
                            type="number"
                            value={h.points}
                            onChange={(e) => updateHouseStanding(h.name, { points: Number(e.target.value) })}
                            className="w-full px-2 py-1 text-xs font-bold bg-stone-50 border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 mb-0.5">House Color</label>
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="color"
                              value={h.color || '#2563eb'}
                              onChange={(e) => updateHouseStanding(h.name, { color: e.target.value })}
                              className="w-7 h-7 rounded border border-stone-300 p-0.5 cursor-pointer"
                            />
                            <input 
                              type="text"
                              value={h.color || '#2563eb'}
                              onChange={(e) => updateHouseStanding(h.name, { color: e.target.value })}
                              className="w-full px-1.5 py-1 text-[10px] font-mono bg-stone-50 border border-stone-300 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 mb-0.5">House Motto</label>
                        <input 
                          type="text"
                          value={h.motto || ''}
                          onChange={(e) => updateHouseStanding(h.name, { motto: e.target.value })}
                          placeholder="e.g. Valour and Integrity"
                          className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg italic text-stone-700"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 mb-0.5">House Master / Mistress</label>
                        <input 
                          type="text"
                          value={h.houseMaster || ''}
                          onChange={(e) => updateHouseStanding(h.name, { houseMaster: e.target.value })}
                          placeholder="e.g. Mr. Olumide Ogunleye"
                          className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB: CONTACT INFORMATION & CAMPUS DESK                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'contact' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveContact} className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="pb-6 border-b border-stone-100">
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-red-600" />
                  Official Contact & Campus Desk Details
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage the physical campus location, admissions hotline, WhatsApp number, and emails displayed on the landing page contact section and footer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Physical School Address</label>
                  <input 
                    type="text"
                    value={contactForm.address}
                    onChange={(e) => setContactForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                  <input 
                    type="text"
                    value={contactForm.city}
                    onChange={(e) => setContactForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">State & Country</label>
                  <input 
                    type="text"
                    value={`${contactForm.state}, ${contactForm.country}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(',');
                      setContactForm(prev => ({
                        ...prev,
                        state: parts[0]?.trim() || prev.state,
                        country: parts[1]?.trim() || prev.country
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">General Inquiries Phone</label>
                  <input 
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Admissions Direct Helpline</label>
                  <input 
                    type="text"
                    value={contactForm.admissionsPhone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, admissionsPhone: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Chat Hotline Number</label>
                  <input 
                    type="text"
                    value={contactForm.whatsapp}
                    onChange={(e) => setContactForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Official School Email</label>
                  <input 
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Contact Details</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. TAB: FACULTY & LEADERSHIP TEAM                                         */}
      {/* ========================================================================= */}
      {activeSubTab === 'faculty' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-600" />
                  Faculty Mentors, Administrators & Leadership
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage section header copy, the Founder's Executive Spotlight, and the profile cards of school tutors and department heads.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetFacultyToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Faculty
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newMember: FacultyMember = {
                      id: `fac-${Date.now()}`,
                      name: 'Mr. Emmanuel Adeyemo',
                      role: 'Senior Science & Robotics Tutor',
                      qualification: 'B.Sc (Ed) Computer Science & Physics (TRCN)',
                      department: 'Sciences & STEM',
                      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
                      bio: 'Passionate about project-based inquiry learning and youth STEM competitions.'
                    };
                    addFacultyMember(newMember);
                    showToast('New faculty mentor added!');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Faculty Member
                </button>
              </div>
            </div>

            {/* Section Header Controls */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
              <div className="text-xs font-black text-amber-950 flex items-center justify-between">
                <span>Faculty Section Header (Headline & Intro)</span>
                <button
                  type="button"
                  onClick={() => {
                    updateSchoolInfo({
                      facultyHeader: {
                        badge: facultyHeaderForm.badge,
                        title: facultyHeaderForm.title,
                        subtitle: facultyHeaderForm.subtitle
                      }
                    });
                    showToast('Faculty section header updated!');
                  }}
                  className="px-3 py-1 bg-amber-500 text-stone-950 text-[11px] font-black rounded-lg hover:bg-amber-400 cursor-pointer"
                >
                  Save Header
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Badge Pill</label>
                  <input
                    type="text"
                    value={facultyHeaderForm.badge}
                    onChange={(e) => setFacultyHeaderForm(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Main Heading</label>
                  <input
                    type="text"
                    value={facultyHeaderForm.title}
                    onChange={(e) => setFacultyHeaderForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={facultyHeaderForm.subtitle}
                    onChange={(e) => setFacultyHeaderForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Founder & Proprietress Spotlight Banner Controls */}
            <div className="p-5 bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl border border-stone-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-700">
                <div>
                  <h4 className="text-sm font-black text-amber-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    Executive Leadership & Founder Spotlight Card
                  </h4>
                  <p className="text-[11px] text-stone-300">
                    The highlighted dark card displayed prominently at the top of the Faculty section.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    updateProprietressProfile({
                      portraitUrl: founderProfileForm.portraitUrl,
                      name: founderProfileForm.name,
                      honorifics: founderProfileForm.honorifics,
                      title: founderProfileForm.title,
                      establishedYear: parseInt(founderProfileForm.establishedYear, 10) || 2007,
                      tagline: founderProfileForm.tagline
                    });
                    if (founderProfileForm.portraitUrl) {
                      updateImage('founders', founderProfileForm.portraitUrl);
                    }
                    showToast("Founder's executive spotlight card updated!");
                  }}
                  className="px-3.5 py-1.5 bg-amber-400 text-stone-950 font-black text-xs rounded-xl hover:bg-amber-300 cursor-pointer shadow-xs"
                >
                  Save Founder Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="space-y-2">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-amber-400/60 bg-stone-950 group mx-auto md:mx-0">
                    <img 
                      src={founderProfileForm.portraitUrl || images.founders || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'}
                      alt="Founder"
                      className="w-full h-full object-cover object-top"
                    />
                    <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer">
                      <Upload className="w-3.5 h-3.5 mb-0.5 text-amber-300" />
                      <span>Upload Photo</span>
                      <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericImageUpload(file, (url) => {
                              setFounderProfileForm(prev => ({ ...prev, portraitUrl: url }));
                              updateProprietressProfile({ portraitUrl: url });
                              updateImage('founders', url);
                            }, 'founder_portrait');
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Photo URL or Upload above"
                    value={founderProfileForm.portraitUrl}
                    onChange={(e) => setFounderProfileForm(prev => ({ ...prev, portraitUrl: e.target.value }))}
                    className="w-full px-2 py-1 text-[10px] bg-stone-800 border border-stone-700 text-stone-200 rounded-lg"
                  />
                </div>

                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-200 mb-1">Founder Full Name</label>
                    <input 
                      type="text"
                      value={founderProfileForm.name}
                      onChange={(e) => setFounderProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs bg-stone-800 border border-stone-700 text-white rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-200 mb-1">Honorifics / Post-Nominals</label>
                    <input 
                      type="text"
                      value={founderProfileForm.honorifics}
                      onChange={(e) => setFounderProfileForm(prev => ({ ...prev, honorifics: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs bg-stone-800 border border-stone-700 text-white rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-200 mb-1">Executive Title</label>
                    <input 
                      type="text"
                      value={founderProfileForm.title}
                      onChange={(e) => setFounderProfileForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs bg-stone-800 border border-stone-700 text-white rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-200 mb-1">Established Year</label>
                    <input 
                      type="text"
                      value={founderProfileForm.establishedYear}
                      onChange={(e) => setFounderProfileForm(prev => ({ ...prev, establishedYear: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs bg-stone-800 border border-stone-700 text-white rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-amber-200 mb-1">Founder Quote / Tagline</label>
                    <textarea 
                      rows={2}
                      value={founderProfileForm.tagline}
                      onChange={(e) => setFounderProfileForm(prev => ({ ...prev, tagline: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs bg-stone-800 border border-stone-700 text-white rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Faculty List Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-stone-900">Faculty Profiles ({facultyList.length})</h4>
                <span className="text-[11px] text-stone-500">Each card is editable with photo upload, role, qualification and bio</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facultyList.map((member) => (
                  <div key={member.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shrink-0 group">
                          <img 
                            src={member.imageUrl || (member.imageKey ? images[member.imageKey] : undefined) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                            alt={member.name}
                            className="w-full h-full object-cover object-top"
                          />
                          <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[9px] font-bold cursor-pointer">
                            <Upload className="w-3 h-3 mb-0.5 text-amber-300" />
                            <span>Photo</span>
                            <input 
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleGenericImageUpload(file, (url) => {
                                    updateFacultyMember(member.id, { imageUrl: url });
                                  }, `fac_${member.id}`);
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <input 
                              type="text"
                              value={member.name}
                              onChange={(e) => updateFacultyMember(member.id, { name: e.target.value })}
                              placeholder="Full Name"
                              className="w-full text-xs font-black bg-white border border-stone-300 rounded-lg px-2 py-1"
                            />
                            <button
                              type="button"
                              onClick={() => deleteFacultyMember(member.id)}
                              className="text-stone-400 hover:text-red-600 p-1 ml-1 cursor-pointer"
                              title="Delete Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input 
                            type="text"
                            value={member.role}
                            onChange={(e) => updateFacultyMember(member.id, { role: e.target.value })}
                            placeholder="Designation / Role"
                            className="w-full text-[11px] font-bold text-red-700 bg-white border border-stone-300 rounded-lg px-2 py-0.5"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Department</label>
                          <input 
                            type="text"
                            value={member.department}
                            onChange={(e) => updateFacultyMember(member.id, { department: e.target.value })}
                            placeholder="e.g. Sciences"
                            className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Qualifications</label>
                          <input 
                            type="text"
                            value={member.qualification}
                            onChange={(e) => updateFacultyMember(member.id, { qualification: e.target.value })}
                            placeholder="e.g. B.Sc, TRCN"
                            className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Photo URL</label>
                        <input 
                          type="text"
                          value={member.imageUrl || ''}
                          onChange={(e) => updateFacultyMember(member.id, { imageUrl: e.target.value })}
                          placeholder="https://... or upload above"
                          className="w-full text-[10px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Short Biography</label>
                        <textarea 
                          rows={2}
                          value={member.bio || ''}
                          onChange={(e) => updateFacultyMember(member.id, { bio: e.target.value })}
                          placeholder="Bio note..."
                          className="w-full text-xs bg-white border border-stone-300 rounded-lg p-1.5"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. TAB: ACADEMIC CALENDAR & DATES                                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  Academic Calendar, Terms & Important Dates
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage the public academic session calendar, term dates, examination weeks, and mid-term breaks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetCalendarEventsToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Calendar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newEvent: AcademicCalendarEvent = {
                      id: `cal-${Date.now()}`,
                      title: 'Mid-Term Continuous Assessment (CA) Week',
                      date: 'Oct 26 - Oct 30, 2026',
                      term: '1st Term',
                      category: 'Exam',
                      description: 'Comprehensive mid-session academic evaluations across all classes.'
                    };
                    addCalendarEvent(newEvent);
                    showToast('New academic calendar event added!');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Calendar Event
                </button>
              </div>
            </div>

            {/* Section Header Controls */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
              <div className="text-xs font-black text-amber-950 flex items-center justify-between">
                <span>Calendar Section Header (Headline & Intro)</span>
                <button
                  type="button"
                  onClick={() => {
                    updateSchoolInfo({
                      calendarHeader: {
                        badge: calendarHeaderForm.badge,
                        title: calendarHeaderForm.title,
                        subtitle: calendarHeaderForm.subtitle
                      }
                    });
                    showToast('Calendar section header updated!');
                  }}
                  className="px-3 py-1 bg-amber-500 text-stone-950 text-[11px] font-black rounded-lg hover:bg-amber-400 cursor-pointer"
                >
                  Save Header
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Badge Pill</label>
                  <input
                    type="text"
                    value={calendarHeaderForm.badge}
                    onChange={(e) => setCalendarHeaderForm(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Main Heading</label>
                  <input
                    type="text"
                    value={calendarHeaderForm.title}
                    onChange={(e) => setCalendarHeaderForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={calendarHeaderForm.subtitle}
                    onChange={(e) => setCalendarHeaderForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-stone-900">Events & Milestones ({calendarEvents.length})</h4>
                <span className="text-[11px] text-stone-500">Filterable by term on the public website</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calendarEvents.map((evt) => (
                  <div key={evt.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <input 
                        type="text"
                        value={evt.title}
                        onChange={(e) => updateCalendarEvent(evt.id, { title: e.target.value })}
                        placeholder="Event Title"
                        className="text-xs font-black bg-white border border-stone-300 rounded-lg px-2 py-1 flex-1 mr-2"
                      />
                      <button
                        type="button"
                        onClick={() => deleteCalendarEvent(evt.id)}
                        className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Term</label>
                        <select 
                          value={evt.term || '1st Term'}
                          onChange={(e) => updateCalendarEvent(evt.id, { term: e.target.value })}
                          className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1 font-bold"
                        >
                          <option value="1st Term">1st Term</option>
                          <option value="2nd Term">2nd Term</option>
                          <option value="3rd Term">3rd Term</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Category</label>
                        <select 
                          value={evt.category}
                          onChange={(e) => updateCalendarEvent(evt.id, { category: e.target.value })}
                          className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                        >
                          <option value="Resumption">Resumption</option>
                          <option value="Exam">Exam / CA</option>
                          <option value="Holiday">Holiday / Break</option>
                          <option value="Sports">Sports & Inter-House</option>
                          <option value="Meeting">PTA Meeting</option>
                          <option value="Celebration">Cultural / Celebration</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Date / Range</label>
                        <input 
                          type="text"
                          value={evt.date}
                          onChange={(e) => updateCalendarEvent(evt.id, { date: e.target.value })}
                          placeholder="e.g. Sep 14, 2026"
                          className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Description & Guidelines</label>
                      <textarea 
                        rows={2}
                        value={evt.description}
                        onChange={(e) => updateCalendarEvent(evt.id, { description: e.target.value })}
                        placeholder="Details for parents and scholars..."
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. TAB: NOTICES & ANNOUNCEMENTS                                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'notices' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-600" />
                  School Notice Board & Official Bulletins
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Post announcements, circulars, and notices for parents, scholars, and staff.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newNotice: Notice = {
                      id: `not-${Date.now()}`,
                      title: 'School Resumption and Uniform Guidelines',
                      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                      category: 'Administrative',
                      content: 'All scholars are expected in immaculate school attire with black polishable shoes on Monday.',
                      audience: 'All',
                      isImportant: true
                    };
                    addNotice(newNotice);
                    showToast('New school bulletin notice published!');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Post New Notice
                </button>
              </div>
            </div>

            {/* Section Header Controls */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
              <div className="text-xs font-black text-amber-950 flex items-center justify-between">
                <span>Notice Board Section Header</span>
                <button
                  type="button"
                  onClick={() => {
                    updateSchoolInfo({
                      noticesHeader: {
                        badge: noticesHeaderForm.badge,
                        title: noticesHeaderForm.title
                      }
                    });
                    showToast('Notice board header updated!');
                  }}
                  className="px-3 py-1 bg-amber-500 text-stone-950 text-[11px] font-black rounded-lg hover:bg-amber-400 cursor-pointer"
                >
                  Save Header
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Badge Pill</label>
                  <input
                    type="text"
                    value={noticesHeaderForm.badge}
                    onChange={(e) => setNoticesHeaderForm(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Main Heading</label>
                  <input
                    type="text"
                    value={noticesHeaderForm.title}
                    onChange={(e) => setNoticesHeaderForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Notices List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-stone-900">Active Bulletins ({notices.length})</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notices.map((n) => (
                  <div key={n.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <input 
                        type="text"
                        value={n.title}
                        onChange={(e) => updateNotice(n.id, { title: e.target.value })}
                        placeholder="Notice Title"
                        className="text-xs font-black bg-white border border-stone-300 rounded-lg px-2 py-1 flex-1 mr-2"
                      />
                      <button
                        type="button"
                        onClick={() => deleteNotice(n.id)}
                        className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Audience</label>
                        <select 
                          value={n.audience || 'All'}
                          onChange={(e) => updateNotice(n.id, { audience: e.target.value as any })}
                          className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1 font-bold"
                        >
                          <option value="All">All</option>
                          <option value="Parents">Parents</option>
                          <option value="Scholars">Scholars</option>
                          <option value="Faculty">Faculty</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Category</label>
                        <input 
                          type="text"
                          value={n.category}
                          onChange={(e) => updateNotice(n.id, { category: e.target.value })}
                          className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Date</label>
                        <input 
                          type="text"
                          value={n.date}
                          onChange={(e) => updateNotice(n.id, { date: e.target.value })}
                          className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Notice Content</label>
                      <textarea 
                        rows={3}
                        value={n.content}
                        onChange={(e) => updateNotice(n.id, { content: e.target.value })}
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. TAB: TESTIMONIALS & REVIEWS                                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-red-600" />
                  Parent & Scholar Testimonials
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage authentic community feedback, star ratings, parent avatars, and quotes displayed on the public landing page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetTestimonialsToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newTestimonial: Testimonial = {
                      id: `test-${Date.now()}`,
                      name: 'Mrs. Folake Adeyemi',
                      relationship: 'Parent of Primary 5 Scholar',
                      studentName: 'Tolu Adeyemi',
                      studentGrade: 'Primary 5 Gold',
                      location: 'Bodija, Ibadan',
                      comment: 'Stanbax has instilled a genuine love of discovery and upright moral character in our daughter.',
                      rating: 5,
                      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
                    };
                    addTestimonial(newTestimonial);
                    showToast('New testimonial review added!');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Testimonial
                </button>
              </div>
            </div>

            {/* Section Header Controls */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
              <div className="text-xs font-black text-amber-950 flex items-center justify-between">
                <span>Testimonials Section Header (Headline & Intro)</span>
                <button
                  type="button"
                  onClick={() => {
                    updateTestimonialsHeader({
                      badge: testimonialHeaderForm?.badge || 'Parent & Scholar Voices',
                      title: testimonialHeaderForm?.title || 'What Families Say About Stanbax Schools',
                      subtitle: testimonialHeaderForm?.subtitle || "Hear from parents and guardians across Bodija, Oluyole, Jericho, and greater Ibadan."
                    });
                    showToast('Testimonials section header updated!');
                  }}
                  className="px-3 py-1 bg-amber-500 text-stone-950 text-[11px] font-black rounded-lg hover:bg-amber-400 cursor-pointer"
                >
                  Save Header
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Badge Pill</label>
                  <input
                    type="text"
                    value={testimonialHeaderForm?.badge || ''}
                    onChange={(e) => setTestimonialHeaderForm(prev => ({ ...(prev || DEFAULT_TESTIMONIALS_HEADER), badge: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Main Heading</label>
                  <input
                    type="text"
                    value={testimonialHeaderForm?.title || ''}
                    onChange={(e) => setTestimonialHeaderForm(prev => ({ ...(prev || DEFAULT_TESTIMONIALS_HEADER), title: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={testimonialHeaderForm?.subtitle || ''}
                    onChange={(e) => setTestimonialHeaderForm(prev => ({ ...(prev || DEFAULT_TESTIMONIALS_HEADER), subtitle: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Testimonials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-stone-200 border border-stone-300 shrink-0 group">
                      <img 
                        src={t.imageUrl || t.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[9px] font-bold cursor-pointer">
                        <Upload className="w-3 h-3 mb-0.5 text-amber-300" />
                        <span>Photo</span>
                        <input 
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleGenericImageUpload(file, (url) => {
                                updateTestimonial(t.id, { imageUrl: url, avatar: url });
                              }, `test_${t.id}`);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <input 
                          type="text"
                          value={t.name}
                          onChange={(e) => updateTestimonial(t.id, { name: e.target.value })}
                          placeholder="Parent Name"
                          className="text-xs font-black bg-white border border-stone-300 rounded-lg px-2 py-1 flex-1 mr-2"
                        />
                        <button
                          type="button"
                          onClick={() => deleteTestimonial(t.id)}
                          className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text"
                          value={t.relationship}
                          onChange={(e) => updateTestimonial(t.id, { relationship: e.target.value, relation: e.target.value })}
                          placeholder="Role / Relation"
                          className="w-full text-[11px] font-bold text-red-700 bg-white border border-stone-300 rounded-lg px-2 py-1"
                        />
                        <input 
                          type="text"
                          value={t.location || ''}
                          onChange={(e) => updateTestimonial(t.id, { location: e.target.value })}
                          placeholder="Location (e.g. Bodija)"
                          className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Rating (1-5)</label>
                      <select 
                        value={t.rating || 5}
                        onChange={(e) => updateTestimonial(t.id, { rating: parseInt(e.target.value, 10) })}
                        className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1 font-bold"
                      >
                        {[5, 4, 3, 2, 1].map(r => (
                          <option key={r} value={r}>{r} Stars</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Scholar Name</label>
                      <input 
                        type="text"
                        value={t.studentName || ''}
                        onChange={(e) => updateTestimonial(t.id, { studentName: e.target.value })}
                        placeholder="Child's Name"
                        className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Class / Grade</label>
                      <input 
                        type="text"
                        value={t.studentGrade || ''}
                        onChange={(e) => updateTestimonial(t.id, { studentGrade: e.target.value })}
                        placeholder="e.g. SSS 2 Science"
                        className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Avatar Image URL</label>
                    <input 
                      type="text"
                      value={t.imageUrl || t.avatar || ''}
                      onChange={(e) => updateTestimonial(t.id, { imageUrl: e.target.value, avatar: e.target.value })}
                      placeholder="https://... or upload above"
                      className="w-full text-[10px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Quote / Review</label>
                    <textarea 
                      rows={3}
                      value={t.comment}
                      onChange={(e) => updateTestimonial(t.id, { comment: e.target.value })}
                      className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. TAB: FAQ (FREQUENTLY ASKED QUESTIONS)                                */}
      {/* ========================================================================= */}
      {activeSubTab === 'faq' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-red-600" />
                  Frequently Asked Questions (FAQ)
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage the questions and answers displayed in the public accordion on the landing page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetFaqToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset FAQ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newFaq: FAQItem = {
                      id: `faq-${Date.now()}`,
                      question: 'What are the school operating hours?',
                      answer: 'Our academic gates open at 07:15 AM Monday through Friday. Regular classes run until 03:00 PM, with enrichment clubs continuing until 04:30 PM.',
                      category: 'General'
                    };
                    addFaqItem(newFaq);
                    showToast('New FAQ item added!');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add FAQ Item
                </button>
              </div>
            </div>

            {/* Section Header Controls */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
              <div className="text-xs font-black text-amber-950 flex items-center justify-between">
                <span>FAQ Section Header</span>
                <button
                  type="button"
                  onClick={() => {
                    updateFaqContent({
                      badge: faqHeaderForm.badge,
                      title: faqHeaderForm.title,
                      subtitle: faqHeaderForm.subtitle
                    });
                    showToast('FAQ section header updated!');
                  }}
                  className="px-3 py-1 bg-amber-500 text-stone-950 text-[11px] font-black rounded-lg hover:bg-amber-400 cursor-pointer"
                >
                  Save Header
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Badge Pill</label>
                  <input
                    type="text"
                    value={faqHeaderForm.badge}
                    onChange={(e) => setFaqHeaderForm(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Main Heading</label>
                  <input
                    type="text"
                    value={faqHeaderForm.title}
                    onChange={(e) => setFaqHeaderForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Section Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={faqHeaderForm.subtitle}
                    onChange={(e) => setFaqHeaderForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* FAQ Items List */}
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input 
                      type="text"
                      value={item.question}
                      onChange={(e) => updateFaqItem(item.id, { question: e.target.value })}
                      placeholder="Question"
                      className="text-xs font-black bg-white border border-stone-300 rounded-lg px-3 py-1.5 flex-1"
                    />
                    <select 
                      value={item.category || 'General'}
                      onChange={(e) => updateFaqItem(item.id, { category: e.target.value })}
                      className="text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-bold"
                    >
                      <option value="Admissions">Admissions</option>
                      <option value="Academics">Academics</option>
                      <option value="Tuition & Fees">Tuition & Fees</option>
                      <option value="Student Life">Student Life</option>
                      <option value="General">General</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => deleteFaqItem(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Answer</label>
                    <textarea 
                      rows={3}
                      value={item.answer}
                      onChange={(e) => updateFaqItem(item.id, { answer: e.target.value })}
                      placeholder="Comprehensive answer..."
                      className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. TAB: FOOTER & SOCIAL MEDIA                                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'footer' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="pb-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-red-600" />
                  Footer Information & Social Media Links
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage the institutional description, ministry accreditation text, copyright statement, and official social media URLs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  updateSchoolInfo({
                    footerBio: footerForm.footerBio,
                    footerAccreditation: footerForm.footerAccreditation,
                    footerCopyright: footerForm.footerCopyright,
                    socialLinks: {
                      facebook: footerForm.facebook,
                      instagram: footerForm.instagram,
                      twitter: footerForm.twitter,
                      linkedin: footerForm.linkedin,
                      youtube: footerForm.youtube
                    }
                  });
                  showToast('Footer copy and social links saved successfully!');
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Save Footer & Social Media</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Footer Mission / Institution Bio</label>
                <textarea 
                  rows={3}
                  value={footerForm.footerBio}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, footerBio: e.target.value }))}
                  placeholder="Dedicated to academic rigour, high moral character, and innovative technology literacy..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Accreditation Verified Notice</label>
                <input 
                  type="text"
                  value={footerForm.footerAccreditation}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, footerAccreditation: e.target.value }))}
                  placeholder="Accredited by Oyo State Ministry of Education & British Council Exam Centre"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Copyright Statement</label>
                <input 
                  type="text"
                  value={footerForm.footerCopyright}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, footerCopyright: e.target.value }))}
                  placeholder="© 2026 Stanbax Schools, Ibadan, Nigeria. All rights reserved."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="md:col-span-2 pt-4 border-t border-stone-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 mb-3">Official Social Media Profiles</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Facebook URL</label>
                    <input 
                      type="url"
                      value={footerForm.facebook}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, facebook: e.target.value }))}
                      placeholder="https://facebook.com/stanbaxschools"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Instagram URL</label>
                    <input 
                      type="url"
                      value={footerForm.instagram}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="https://instagram.com/stanbaxschools"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Twitter / X URL</label>
                    <input 
                      type="url"
                      value={footerForm.twitter}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, twitter: e.target.value }))}
                      placeholder="https://x.com/stanbaxschools"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">LinkedIn URL</label>
                    <input 
                      type="url"
                      value={footerForm.linkedin}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="https://linkedin.com/company/stanbaxschools"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">YouTube URL</label>
                    <input 
                      type="url"
                      value={footerForm.youtube}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, youtube: e.target.value }))}
                      placeholder="https://youtube.com/@stanbaxschools"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
