import React from 'react';
import { WorkItem } from '../types/work';
import { Sparkles, Eye, Download, Trash2, ExternalLink } from 'lucide-react';

interface WorkListViewProps {
  works: WorkItem[];
  onSelect: (work: WorkItem) => void;
  onAnalyze: (work: WorkItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const WorkListView: React.FC<WorkListViewProps> = ({
  works,
  onSelect,
  onAnalyze,
  onDelete,
}) => {
  if (works.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 font-mono">
              <th className="py-3 px-4 font-medium">Work Title & File</th>
              <th className="py-3 px-4 font-medium">Discipline</th>
              <th className="py-3 px-4 font-medium hidden md:table-cell">Context / Client</th>
              <th className="py-3 px-4 font-medium hidden lg:table-cell">Tags</th>
              <th className="py-3 px-4 font-medium text-right">Size</th>
              <th className="py-3 px-4 font-medium text-right hidden sm:table-cell">Uploaded</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-800">
            {works.map((work) => {
              const formattedSize = work.fileSize > 1024 * 1024
                ? `${(work.fileSize / (1024 * 1024)).toFixed(1)} MB`
                : `${Math.round(work.fileSize / 1024 || 1)} KB`;

              const formattedDate = new Date(work.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr
                  key={work.id}
                  onClick={() => onSelect(work)}
                  className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                >
                  {/* Title & Filename */}
                  <td className="py-3.5 px-4 font-medium text-zinc-900 max-w-xs truncate">
                    <div className="flex flex-col">
                      <span className="font-semibold group-hover:text-zinc-950 truncate">
                        {work.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono truncate">
                        {work.fileName}
                      </span>
                    </div>
                  </td>

                  {/* Discipline */}
                  <td className="py-3.5 px-4 text-zinc-600 whitespace-nowrap">
                    {work.category}
                  </td>

                  {/* Context / Client */}
                  <td className="py-3.5 px-4 text-zinc-500 hidden md:table-cell whitespace-nowrap">
                    {work.clientOrContext || '—'}
                  </td>

                  {/* Tags */}
                  <td className="py-3.5 px-4 text-zinc-500 hidden lg:table-cell max-w-xs truncate">
                    {work.tags.slice(0, 3).join(' · ')}
                  </td>

                  {/* File Size */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-zinc-600 whitespace-nowrap">
                    {formattedSize}
                  </td>

                  {/* Upload Date */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-zinc-500 hidden sm:table-cell whitespace-nowrap">
                    {formattedDate}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelect(work)}
                        title="View and inspect"
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onAnalyze(work)}
                        title="AI Analysis"
                        className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-md transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => onDelete(work.id, e)}
                        title="Delete work"
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
