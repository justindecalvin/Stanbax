import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { GalleryPhoto } from '../types';
import { DEFAULT_GALLERY_PHOTOS } from '../data/defaultGalleryPhotos';
import { Camera, ArrowRight, Eye } from 'lucide-react';

interface CampusGalleryProps {
  onOpenAdmissions?: () => void;
  previewMode?: boolean;
  showAdminControls?: boolean;
}

export const CampusGallery: React.FC<CampusGalleryProps> = ({ 
  onOpenAdmissions, 
  previewMode = false,
  showAdminControls = false
}) => {
  const { galleryPhotos, schoolInfo } = useSchool();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const categories = ['All', 'facilities', 'sports', 'arts', 'academics', 'events'];

  const photos: GalleryPhoto[] = galleryPhotos && galleryPhotos.length > 0 ? galleryPhotos : DEFAULT_GALLERY_PHOTOS;

  const filteredPhotos = activeCategory === 'All' 
    ? photos 
    : photos.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Campus Life & Facilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif">
            A Glimpse Into Life at {schoolInfo?.name || 'Stanbax Schools'}
          </h2>
          <p className="text-base text-stone-600 leading-relaxed">
            Explore our laboratories, tech-enabled classrooms, sporting facilities, and rich cultural activities designed to nurture future global leaders.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => setSelectedPhoto(photo.imageUrl)}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-200 transition-all duration-300 bg-stone-100 aspect-4/3 cursor-pointer"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 inline-block">
                  {photo.category || 'facilities'}
                </span>
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {photo.title}
                </h4>
                {photo.caption && (
                  <p className="text-xs text-stone-300 line-clamp-2">
                    {photo.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {onOpenAdmissions && (
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={onOpenAdmissions}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-lg hover:shadow-red-500/25 transition-all cursor-pointer"
            >
              <span>Schedule an In-Person Campus Tour</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={selectedPhoto}
            alt="Enlarged Campus View"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </section>
  );
};
