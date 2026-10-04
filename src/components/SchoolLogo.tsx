import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { GraduationCap } from 'lucide-react';

interface SchoolLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light';
  showText?: boolean;
  className?: string;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showText = true,
  className = ''
}) => {
  const { schoolInfo } = useSchool();

  const sizeDimensions = {
    xs: { icon: 'w-6 h-6 text-xs', crest: 'w-6 h-6', title: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 'w-8 h-8 text-sm', crest: 'w-8 h-8', title: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 'w-10 h-10 text-base', crest: 'w-10 h-10', title: 'text-base font-bold', sub: 'text-xs' },
    lg: { icon: 'w-14 h-14 text-xl', crest: 'w-14 h-14', title: 'text-xl font-extrabold', sub: 'text-sm' },
    xl: { icon: 'w-20 h-20 text-3xl', crest: 'w-20 h-20', title: 'text-2xl font-black', sub: 'text-base' }
  }[size];

  const logoUrl = schoolInfo?.logoUrl;
  const schoolName = schoolInfo?.name || 'Stanbax Schools';
  const schoolMotto = schoolInfo?.motto || 'Excellence, Character & Global Leadership';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={schoolName}
          className={`${sizeDimensions.crest} object-contain rounded-xl shadow-xs`}
        />
      ) : (
        <div
          className={`${sizeDimensions.crest} rounded-xl bg-gradient-to-tr from-blue-950 via-indigo-900 to-amber-600 flex items-center justify-center text-white shadow-md font-serif font-black tracking-wider ring-2 ring-amber-400/40 shrink-0`}
        >
          <GraduationCap className="w-1/2 h-1/2 text-amber-300" />
        </div>
      )}

      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={`${sizeDimensions.title} tracking-tight ${
              variant === 'light' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {schoolName}
          </span>
          <span
            className={`${sizeDimensions.sub} font-medium ${
              variant === 'light' ? 'text-amber-300' : 'text-amber-700'
            }`}
          >
            {schoolMotto}
          </span>
        </div>
      )}
    </div>
  );
};
