import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Award,
  School as SchoolIcon
} from './RealIcons';

interface StudentLifeSectionProps {
  onOpenAdmissions?: () => void;
}

export const StudentLifeSection: React.FC<StudentLifeSectionProps> = ({ onOpenAdmissions }) => {
  const { clubs, houseStandings, schoolInfo, images } = useSchool();
  const [activeSubTab, setActiveSubTab] = useState<'houses' | 'clubs'>('houses');

  const headerBadge = schoolInfo.studentLifeHeader?.badge || 'School Life & Holistic Development';
  const headerTitle = schoolInfo.studentLifeHeader?.title || 'Vibrant Student Life at Stanbax Schools';
  const headerSubtitle = schoolInfo.studentLifeHeader?.subtitle || 'Beyond classroom instruction, our scholars thrive in inter-house sports competitions, academic & STEM clubs, cultural festivities, and holistic character development.';

  const sportsImg = images.sports || schoolInfo.studentLifeHeader?.sportsPhotoUrl || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80';
  const culturalImg = images.cultural || schoolInfo.studentLifeHeader?.culturalPhotoUrl || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80';
  const artImg = images.artClass || schoolInfo.studentLifeHeader?.artPhotoUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80';

  const sportsBadge = schoolInfo.studentLifeHeader?.sportsBadge || 'Athletics & Fitness';
  const sportsTitle = schoolInfo.studentLifeHeader?.sportsTitle || 'Inter-House Sports Tournament';
  const culturalBadge = schoolInfo.studentLifeHeader?.culturalBadge || 'Heritage & Unity';
  const culturalTitle = schoolInfo.studentLifeHeader?.culturalTitle || 'Annual Cultural Day & Arts';
  const artBadge = schoolInfo.studentLifeHeader?.artBadge || 'Discovery & Design';
  const artTitle = schoolInfo.studentLifeHeader?.artTitle || 'Creative Arts & STEM Labs';

  return (
    <section className="py-20 bg-[#FDFBF7] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{headerBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {headerTitle}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            {headerSubtitle}
          </p>
        </div>

        {/* Student Life Photo Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200 group h-52">
            <img 
              src={sportsImg} 
              alt={sportsTitle} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-5">
              <div className="text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">{sportsBadge}</span>
                <h4 className="text-sm font-black">{sportsTitle}</h4>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200 group h-52">
            <img 
              src={culturalImg} 
              alt={culturalTitle} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-5">
              <div className="text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">{culturalBadge}</span>
                <h4 className="text-sm font-black">{culturalTitle}</h4>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200 group h-52">
            <img 
              src={artImg} 
              alt={artTitle} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-5">
              <div className="text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">{artBadge}</span>
                <h4 className="text-sm font-black">{artTitle}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tab selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveSubTab('houses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'houses' ? 'bg-red-600 text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Inter-House Standings</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('clubs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'clubs' ? 'bg-red-600 text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Co-Curricular Clubs & Societies</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeSubTab === 'houses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {houseStandings.map((house, idx) => (
              <div
                key={house.name}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden flex flex-col justify-between"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{ backgroundColor: house.color }}
                />
                <div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                      Rank #{idx + 1}
                    </span>
                    <Trophy className="w-4 h-4" style={{ color: house.color }} />
                  </div>
                  <h3 className="font-bold text-base text-stone-900 mt-1">{house.name}</h3>
                  <p className="text-xs text-stone-500 italic mt-0.5">"{house.motto}"</p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">Total Points</span>
                  <span className="text-lg font-black text-stone-900">{house.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'clubs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clubs.map(club => (
              <div key={club.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                    {club.category}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">{club.meetingDay}</span>
                </div>
                <h3 className="font-bold text-stone-900 text-base mt-2">{club.name}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{club.description}</p>
                <div className="text-[11px] text-stone-500 mt-3 font-semibold">
                  Faculty Patron: {club.patron}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
