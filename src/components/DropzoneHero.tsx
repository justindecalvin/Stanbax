import React, { useRef, useState } from 'react';
import { Upload, FileUp, Clipboard, Code2, Search, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { WorkCategory } from '../types/work';

interface DropzoneHeroProps {
  onFilesSelected: (files: FileList | File[]) => void;
  onOpenQuickPaste: () => void;
  onOpenCodeEditor: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: WorkCategory | 'All';
  onCategorySelect: (cat: WorkCategory | 'All') => void;
  worksCount: number;
}

export const DropzoneHero: React.FC<DropzoneHeroProps> = ({
  onFilesSelected,
  onOpenQuickPaste,
  onOpenCodeEditor,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategorySelect,
  worksCount,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="relative pt-8 pb-10 border-b border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header / Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-display">
              Upload and showcase your work.
            </h1>
            <p className="mt-2 text-base text-zinc-600 leading-relaxed">
              Drop any files here—design assets, code repositories, research PDFs, media reels, or client deliverables. Securely stored with instant previews and smart critique.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono tabular-nums">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Encrypted local storage active</span>
            <span aria-hidden="true">·</span>
            <span>Zero file-size upload caps</span>
          </div>
        </div>

        {/* Drag and Drop Action Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-10 transition-all duration-200 text-center ${
            isDragOver
              ? 'border-zinc-900 bg-zinc-100/80 scale-[1.005]'
              : 'border-zinc-300 hover:border-zinc-800 bg-zinc-50/60 hover:bg-zinc-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="w-14 h-14 mb-4 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-zinc-800 group-hover:scale-110 group-hover:border-zinc-400 transition-transform">
              <Upload className="w-6 h-6" />
            </div>

            <div className="text-base font-semibold text-zinc-900 group-hover:text-zinc-950 flex items-center gap-1.5">
              <span>Drop files anywhere or click to browse</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 transition-colors" />
            </div>

            <p className="mt-1.5 text-xs text-zinc-500">
              Supports PNG, JPG, SVG, WebP · PDF, DOCX, Markdown, Text · TypeScript, Python, JSON · MP3, WAV, MP4
            </p>

            {/* Quick Upload Modes */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-zinc-800 bg-white border border-zinc-200 rounded-lg hover:border-zinc-400 hover:bg-zinc-50 shadow-xs transition-colors"
              >
                <FileUp className="w-3.5 h-3.5 text-zinc-500" />
                Select from Computer
              </button>

              <button
                type="button"
                onClick={onOpenQuickPaste}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-zinc-800 bg-white border border-zinc-200 rounded-lg hover:border-zinc-400 hover:bg-zinc-50 shadow-xs transition-colors"
              >
                <Clipboard className="w-3.5 h-3.5 text-zinc-500" />
                Paste from Clipboard
              </button>

              <button
                type="button"
                onClick={onOpenCodeEditor}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-zinc-800 bg-white border border-zinc-200 rounded-lg hover:border-zinc-400 hover:bg-zinc-50 shadow-xs transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-zinc-500" />
                Write Code / Text
              </button>
            </div>
          </div>
        </div>

        {/* Live Filter & Search Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Tabs (Functional buttons) */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl overflow-x-auto">
            {(['All', 'Design & Art', 'Code & Engineering', 'Writing & Research', 'Media & Audio'] as (WorkCategory | 'All')[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onCategorySelect(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search works, tags, filenames..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
