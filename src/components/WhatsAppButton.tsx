import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { PhoneCall } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { schoolInfo } = useSchool();
  const phone = (schoolInfo.whatsapp || schoolInfo.admissionsPhone || schoolInfo.phone || '+2348031234567').replace(/[^0-9]/g, '');

  return (
    <aside aria-label="Admissions helpline assistance" className="fixed bottom-6 right-6 z-30">
      <a
        href={`https://wa.me/${phone}?text=${encodeURIComponent("Hello Stanbax Schools Admissions Desk! I would like to inquire about admissions and tuition.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ring-4 ring-emerald-500/25 group cursor-pointer"
        title="Chat with Stanbax Admissions Desk on WhatsApp"
        aria-label="Chat with Admissions on WhatsApp"
      >
        <PhoneCall className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
      </a>
    </aside>
  );
};
